// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RestInUPropertyNFT
 * @dev ERC721 contract for REST-IN-U Property NFTs with Vastu certification
 */
contract RestInUPropertyNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Property Details
    struct PropertyData {
        string propertyId;      // Backend property ID
        string streetAddress;
        string city;
        string state;
        uint256 price;          // Price in wei
        uint256 squareFeet;
        uint8 vastuScore;       // 0-100
        string vastuGrade;      // A+, A, B+, B, C, D, F
        uint256 registeredAt;
        bool isVerified;
    }

    // Vastu Certificate
    struct VastuCertificate {
        uint256 tokenId;
        uint8 score;
        string grade;
        string entranceDirection;
        bytes32 analysisHash;   // Hash of full analysis for verification
        uint256 issuedAt;
        bool isValid;
    }

    // Storage
    mapping(uint256 => PropertyData) public properties;
    mapping(uint256 => VastuCertificate) public vastuCertificates;
    mapping(string => uint256) public propertyIdToTokenId; // Backend ID -> Token ID
    
    // Authorized minters (backend services)
    mapping(address => bool) public authorizedMinters;

    // Events
    event PropertyRegistered(uint256 indexed tokenId, string propertyId, address owner);
    event VastuCertified(uint256 indexed tokenId, uint8 score, string grade);
    event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event PropertyVerified(uint256 indexed tokenId, bool isVerified);

    constructor() ERC721("REST-IN-U Property", "RESTINU") Ownable(msg.sender) {
        authorizedMinters[msg.sender] = true;
    }

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    /**
     * @dev Register a new property as an NFT
     */
    function registerProperty(
        address to,
        string memory propertyId,
        string memory streetAddress,
        string memory city,
        string memory state,
        uint256 price,
        uint256 squareFeet,
        string memory uri
    ) public onlyAuthorizedMinter returns (uint256) {
        require(propertyIdToTokenId[propertyId] == 0, "Property already registered");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        properties[tokenId] = PropertyData({
            propertyId: propertyId,
            streetAddress: streetAddress,
            city: city,
            state: state,
            price: price,
            squareFeet: squareFeet,
            vastuScore: 0,
            vastuGrade: "",
            registeredAt: block.timestamp,
            isVerified: false
        });

        propertyIdToTokenId[propertyId] = tokenId;

        emit PropertyRegistered(tokenId, propertyId, to);
        return tokenId;
    }

    /**
     * @dev Issue Vastu certificate for a property
     */
    function issueVastuCertificate(
        uint256 tokenId,
        uint8 score,
        string memory grade,
        string memory entranceDirection,
        bytes32 analysisHash
    ) public onlyAuthorizedMinter {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        require(score <= 100, "Invalid score");

        properties[tokenId].vastuScore = score;
        properties[tokenId].vastuGrade = grade;

        vastuCertificates[tokenId] = VastuCertificate({
            tokenId: tokenId,
            score: score,
            grade: grade,
            entranceDirection: entranceDirection,
            analysisHash: analysisHash,
            issuedAt: block.timestamp,
            isValid: true
        });

        emit VastuCertified(tokenId, score, grade);
    }

    /**
     * @dev Verify a property (by admin/verifier)
     */
    function verifyProperty(uint256 tokenId, bool isVerified) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        properties[tokenId].isVerified = isVerified;
        emit PropertyVerified(tokenId, isVerified);
    }

    /**
     * @dev Update property price
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) public {
        require(ownerOf(tokenId) == msg.sender, "Not property owner");
        properties[tokenId].price = newPrice;
    }

    /**
     * @dev Add/remove authorized minter
     */
    function setAuthorizedMinter(address minter, bool authorized) public onlyOwner {
        authorizedMinters[minter] = authorized;
    }

    /**
     * @dev Get property by backend ID
     */
    function getPropertyByBackendId(string memory propertyId) public view returns (PropertyData memory) {
        uint256 tokenId = propertyIdToTokenId[propertyId];
        require(tokenId != 0, "Property not found");
        return properties[tokenId];
    }

    /**
     * @dev Get Vastu certificate
     */
    function getVastuCertificate(uint256 tokenId) public view returns (VastuCertificate memory) {
        return vastuCertificates[tokenId];
    }

    /**
     * @dev Check if property has valid Vastu certification
     */
    function hasValidVastuCertificate(uint256 tokenId) public view returns (bool) {
        return vastuCertificates[tokenId].isValid && vastuCertificates[tokenId].score > 0;
    }

    /**
     * @dev Total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = super._update(to, tokenId, auth);
        if (from != address(0) && to != address(0)) {
            emit PropertyTransferred(tokenId, from, to);
        }
        return from;
    }
}
