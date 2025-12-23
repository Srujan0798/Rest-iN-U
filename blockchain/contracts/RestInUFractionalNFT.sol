// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RestInUFractionalNFT
 * @dev ERC1155 contract for fractional property ownership in REST-IN-U
 */
contract RestInUFractionalNFT is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _propertyIdCounter;

    // Fractional Property Info
    struct FractionalProperty {
        string backendPropertyId;
        string name;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;      // In wei
        uint256 totalValue;         // In wei
        uint8 vastuScore;
        bool isActive;
        uint256 createdAt;
        address propertyManager;
    }

    // Share Ownership
    struct ShareHolder {
        uint256 shares;
        uint256 purchasePrice;
        uint256 purchaseDate;
    }

    // Dividend Distribution
    struct Dividend {
        uint256 propertyId;
        uint256 amount;             // Total dividend amount
        uint256 perShareAmount;
        uint256 distributedAt;
        uint256 expiresAt;
    }

    // Storage
    mapping(uint256 => FractionalProperty) public fractionalProperties;
    mapping(uint256 => mapping(address => ShareHolder)) public shareHolders;
    mapping(uint256 => address[]) public propertyInvestors;
    mapping(uint256 => Dividend[]) public propertyDividends;
    mapping(uint256 => mapping(address => uint256)) public claimedDividends; // propertyId => holder => dividendIndex
    
    mapping(string => uint256) public backendIdToPropertyId;
    mapping(address => bool) public authorizedManagers;

    // Events
    event PropertyFractionalized(uint256 indexed propertyId, string backendId, uint256 totalShares, uint256 pricePerShare);
    event SharesPurchased(uint256 indexed propertyId, address indexed buyer, uint256 shares, uint256 paid);
    event SharesTransferred(uint256 indexed propertyId, address indexed from, address indexed to, uint256 shares);
    event DividendDistributed(uint256 indexed propertyId, uint256 totalAmount, uint256 perShareAmount);
    event DividendClaimed(uint256 indexed propertyId, address indexed holder, uint256 amount);
    event PropertyDeactivated(uint256 indexed propertyId);

    constructor() ERC1155("https://api.restinu.com/fractional/{id}.json") Ownable(msg.sender) {
        authorizedManagers[msg.sender] = true;
    }

    modifier onlyAuthorizedManager() {
        require(authorizedManagers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    modifier onlyPropertyManager(uint256 propertyId) {
        require(
            fractionalProperties[propertyId].propertyManager == msg.sender || 
            msg.sender == owner(),
            "Not property manager"
        );
        _;
    }

    /**
     * @dev Create a new fractionalized property
     */
    function fractionalizeProperty(
        string memory backendPropertyId,
        string memory name,
        uint256 totalShares,
        uint256 pricePerShare,
        uint8 vastuScore,
        address propertyManager
    ) public onlyAuthorizedManager returns (uint256) {
        require(backendIdToPropertyId[backendPropertyId] == 0, "Property already fractionalized");
        require(totalShares > 0 && totalShares <= 10000, "Invalid share count");

        _propertyIdCounter.increment();
        uint256 propertyId = _propertyIdCounter.current();

        fractionalProperties[propertyId] = FractionalProperty({
            backendPropertyId: backendPropertyId,
            name: name,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            totalValue: totalShares * pricePerShare,
            vastuScore: vastuScore,
            isActive: true,
            createdAt: block.timestamp,
            propertyManager: propertyManager
        });

        backendIdToPropertyId[backendPropertyId] = propertyId;

        // Mint all shares to contract (treasury)
        _mint(address(this), propertyId, totalShares, "");

        emit PropertyFractionalized(propertyId, backendPropertyId, totalShares, pricePerShare);
        return propertyId;
    }

    /**
     * @dev Purchase shares in a property
     */
    function buyShares(uint256 propertyId, uint256 shares) public payable {
        FractionalProperty storage prop = fractionalProperties[propertyId];
        require(prop.isActive, "Property not active");
        require(shares > 0 && shares <= prop.availableShares, "Invalid share amount");
        require(msg.value >= shares * prop.pricePerShare, "Insufficient payment");

        prop.availableShares -= shares;

        // Track shareholder
        if (shareHolders[propertyId][msg.sender].shares == 0) {
            propertyInvestors[propertyId].push(msg.sender);
        }
        
        shareHolders[propertyId][msg.sender].shares += shares;
        shareHolders[propertyId][msg.sender].purchasePrice += msg.value;
        shareHolders[propertyId][msg.sender].purchaseDate = block.timestamp;

        // Transfer shares from contract to buyer
        _safeTransferFrom(address(this), msg.sender, propertyId, shares, "");

        // Refund excess payment
        if (msg.value > shares * prop.pricePerShare) {
            payable(msg.sender).transfer(msg.value - (shares * prop.pricePerShare));
        }

        emit SharesPurchased(propertyId, msg.sender, shares, shares * prop.pricePerShare);
    }

    /**
     * @dev Distribute dividends to shareholders
     */
    function distributeDividend(uint256 propertyId) public payable onlyPropertyManager(propertyId) {
        require(msg.value > 0, "No dividend to distribute");
        FractionalProperty storage prop = fractionalProperties[propertyId];
        require(prop.isActive, "Property not active");

        uint256 soldShares = prop.totalShares - prop.availableShares;
        require(soldShares > 0, "No shares sold");

        uint256 perShareAmount = msg.value / soldShares;

        propertyDividends[propertyId].push(Dividend({
            propertyId: propertyId,
            amount: msg.value,
            perShareAmount: perShareAmount,
            distributedAt: block.timestamp,
            expiresAt: block.timestamp + 365 days
        }));

        emit DividendDistributed(propertyId, msg.value, perShareAmount);
    }

    /**
     * @dev Claim available dividends
     */
    function claimDividends(uint256 propertyId) public {
        uint256 userShares = balanceOf(msg.sender, propertyId);
        require(userShares > 0, "No shares owned");

        uint256 totalClaimable = 0;
        uint256 lastClaimed = claimedDividends[propertyId][msg.sender];

        for (uint256 i = lastClaimed; i < propertyDividends[propertyId].length; i++) {
            Dividend storage div = propertyDividends[propertyId][i];
            if (block.timestamp <= div.expiresAt) {
                totalClaimable += div.perShareAmount * userShares;
            }
        }

        require(totalClaimable > 0, "No dividends to claim");

        claimedDividends[propertyId][msg.sender] = propertyDividends[propertyId].length;
        payable(msg.sender).transfer(totalClaimable);

        emit DividendClaimed(propertyId, msg.sender, totalClaimable);
    }

    /**
     * @dev Get investor count for a property
     */
    function getInvestorCount(uint256 propertyId) public view returns (uint256) {
        return propertyInvestors[propertyId].length;
    }

    /**
     * @dev Get user's share percentage
     */
    function getSharePercentage(uint256 propertyId, address holder) public view returns (uint256) {
        uint256 shares = balanceOf(holder, propertyId);
        if (shares == 0) return 0;
        return (shares * 10000) / fractionalProperties[propertyId].totalShares; // Basis points
    }

    /**
     * @dev Deactivate property (no more sales)
     */
    function deactivateProperty(uint256 propertyId) public onlyPropertyManager(propertyId) {
        fractionalProperties[propertyId].isActive = false;
        emit PropertyDeactivated(propertyId);
    }

    /**
     * @dev Set authorized manager
     */
    function setAuthorizedManager(address manager, bool authorized) public onlyOwner {
        authorizedManagers[manager] = authorized;
    }

    /**
     * @dev Total properties
     */
    function totalProperties() public view returns (uint256) {
        return _propertyIdCounter.current();
    }

    /**
     * @dev Override to track transfers
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        super._update(from, to, ids, values);
        
        for (uint256 i = 0; i < ids.length; i++) {
            if (from != address(0) && to != address(0) && from != address(this)) {
                emit SharesTransferred(ids[i], from, to, values[i]);
            }
        }
    }

    // Receive function for dividends
    receive() external payable {}
}
