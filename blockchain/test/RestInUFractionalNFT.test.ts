import { expect } from "chai";
import { ethers } from "hardhat";
import { RestInUFractionalNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("RestInUFractionalNFT", function () {
    let fractionalNFT: RestInUFractionalNFT;
    let owner: SignerWithAddress;
    let authorizedManager: SignerWithAddress;
    let propertyManager: SignerWithAddress;
    let investor1: SignerWithAddress;
    let investor2: SignerWithAddress;

    beforeEach(async function () {
        [owner, authorizedManager, propertyManager, investor1, investor2] = await ethers.getSigners();

        const FractionalNFT = await ethers.getContractFactory("RestInUFractionalNFT");
        fractionalNFT = await FractionalNFT.deploy();
        await fractionalNFT.waitForDeployment();

        // Authorize manager
        await fractionalNFT.setAuthorizedManager(authorizedManager.address, true);
    });

    describe("Fractionalization", function () {
        it("Should allow authorized manager to fractionalize property", async function () {
            const tx = await fractionalNFT.connect(authorizedManager).fractionalizeProperty(
                "prop_backend_123",
                "Luxury Villa",
                1000, // Total shares
                ethers.parseEther("0.1"), // Price per share (0.1 ETH)
                95, // Vastu score
                propertyManager.address
            );

            await expect(tx).to.emit(fractionalNFT, "PropertyFractionalized")
                .withArgs(1, "prop_backend_123", 1000, ethers.parseEther("0.1"));

            const prop = await fractionalNFT.fractionalProperties(1);
            expect(prop.name).to.equal("Luxury Villa");
            expect(prop.totalShares).to.equal(1000);
            expect(prop.availableShares).to.equal(1000);
        });

        it("Should fail if unauthorized user tries to fractionalize", async function () {
            await expect(
                fractionalNFT.connect(investor1).fractionalizeProperty(
                    "prop_backend_123", "Name", 100, 100, 90, propertyManager.address
                )
            ).to.be.revertedWith("Not authorized");
        });
    });

    describe("Buying Shares", function () {
        beforeEach(async function () {
            await fractionalNFT.connect(authorizedManager).fractionalizeProperty(
                "prop_backend_123",
                "Luxury Villa",
                1000,
                ethers.parseEther("0.1"),
                95,
                propertyManager.address
            );
        });

        it("Should allow investor to buy shares", async function () {
            const sharesToBuy = 10;
            const cost = ethers.parseEther("1.0"); // 10 * 0.1

            const tx = await fractionalNFT.connect(investor1).buyShares(1, sharesToBuy, { value: cost });

            await expect(tx).to.emit(fractionalNFT, "SharesPurchased")
                .withArgs(1, investor1.address, sharesToBuy, cost);

            const balance = await fractionalNFT.balanceOf(investor1.address, 1);
            expect(balance).to.equal(sharesToBuy);

            const prop = await fractionalNFT.fractionalProperties(1);
            expect(prop.availableShares).to.equal(990);
        });

        it("Should fail if insufficient payment", async function () {
            await expect(
                fractionalNFT.connect(investor1).buyShares(1, 10, { value: ethers.parseEther("0.5") })
            ).to.be.revertedWith("Insufficient payment");
        });

        it("Should fail if requesting more shares than available", async function () {
            await expect(
                fractionalNFT.connect(investor1).buyShares(1, 1001, { value: ethers.parseEther("1000") })
            ).to.be.revertedWith("Invalid share amount");
        });
    });

    describe("Dividends", function () {
        beforeEach(async function () {
            await fractionalNFT.connect(authorizedManager).fractionalizeProperty(
                "prop_backend_123", "Luxury Villa", 1000, ethers.parseEther("0.1"), 95, propertyManager.address
            );
            // Investor buys 100 shares (10% ownership)
            await fractionalNFT.connect(investor1).buyShares(1, 100, { value: ethers.parseEther("10") });
        });

        it("Should allow property manager to distribute dividends", async function () {
            const dividendAmount = ethers.parseEther("1.0"); // 1 ETH total dividend

            // Only 100 shares are sold. Dividend per share = 1 ETH / 100 = 0.01 ETH

            const tx = await fractionalNFT.connect(propertyManager).distributeDividend(1, { value: dividendAmount });

            await expect(tx).to.emit(fractionalNFT, "DividendDistributed");
        });

        it("Should allow investor to claim dividends", async function () {
            const dividendAmount = ethers.parseEther("1.0");
            await fractionalNFT.connect(propertyManager).distributeDividend(1, { value: dividendAmount });

            // Investor owns 100 shares. Per share = 0.01 ETH. Claim = 1.0 ETH.
            // Wait, logic in contract: perShareAmount = msg.value / soldShares.
            // soldShares = 100. msg.value = 1.0. perShare = 0.01.
            // Investor claim = 0.01 * 100 = 1.0.

            const initialBalance = await ethers.provider.getBalance(investor1.address);

            const tx = await fractionalNFT.connect(investor1).claimDividends(1);
            const receipt = await tx.wait();

            // Check event
            await expect(tx).to.emit(fractionalNFT, "DividendClaimed")
                .withArgs(1, investor1.address, ethers.parseEther("1.0"));
        });
    });
});
