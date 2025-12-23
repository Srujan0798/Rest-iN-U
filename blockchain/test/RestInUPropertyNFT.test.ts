import { expect } from "chai";
import { ethers } from "hardhat";
import { RestInUPropertyNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("RestInUPropertyNFT", function () {
    let propertyNFT: RestInUPropertyNFT;
    let owner: SignerWithAddress;
    let authorizedMinter: SignerWithAddress;
    let user: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async function () {
        [owner, authorizedMinter, user, ...addrs] = await ethers.getSigners();

        const PropertyNFT = await ethers.getContractFactory("RestInUPropertyNFT");
        propertyNFT = await PropertyNFT.deploy();
        await propertyNFT.waitForDeployment();

        // Authorize minter
        await propertyNFT.setAuthorizedMinter(authorizedMinter.address, true);
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await propertyNFT.owner()).to.equal(owner.address);
        });

        it("Should have correct name and symbol", async function () {
            expect(await propertyNFT.name()).to.equal("REST-IN-U Property");
            expect(await propertyNFT.symbol()).to.equal("RESTINU");
        });
    });

    describe("Registration (Minting)", function () {
        it("Should allow authorized minter to register property", async function () {
            const tx = await propertyNFT.connect(authorizedMinter).registerProperty(
                user.address,
                "prop_123",
                "123 Main St",
                "Crypto City",
                "Metaverse",
                ethers.parseEther("100"),
                2000,
                "ipfs://metadata"
            );

            await expect(tx).to.emit(propertyNFT, "PropertyRegistered")
                .withArgs(1, "prop_123", user.address);

            expect(await propertyNFT.ownerOf(1)).to.equal(user.address);
        });

        it("Should fail if unauthorized user tries to register", async function () {
            await expect(
                propertyNFT.connect(user).registerProperty(
                    user.address,
                    "prop_123",
                    "123 Main St",
                    "City",
                    "State",
                    100,
                    2000,
                    "uri"
                )
            ).to.be.revertedWith("Not authorized to mint");
        });

        it("Should store correct property data", async function () {
            await propertyNFT.connect(authorizedMinter).registerProperty(
                user.address,
                "prop_123",
                "123 Main St",
                "Crypto City",
                "Metaverse",
                ethers.parseEther("100"),
                2000,
                "ipfs://metadata"
            );

            const data = await propertyNFT.properties(1);
            expect(data.propertyId).to.equal("prop_123");
            expect(data.price).to.equal(ethers.parseEther("100"));
            expect(data.isVerified).to.be.false;
        });
    });

    describe("Vastu Certification", function () {
        beforeEach(async function () {
            await propertyNFT.connect(authorizedMinter).registerProperty(
                user.address, "prop_123", "Addr", "City", "State", 100, 2000, "uri"
            );
        });

        it("Should allow authorized minter to issue certificate", async function () {
            const tx = await propertyNFT.connect(authorizedMinter).issueVastuCertificate(
                1,
                95,
                "A+",
                "East",
                ethers.keccak256(ethers.toUtf8Bytes("analysis"))
            );

            await expect(tx).to.emit(propertyNFT, "VastuCertified")
                .withArgs(1, 95, "A+");

            const cert = await propertyNFT.getVastuCertificate(1);
            expect(cert.isValid).to.be.true;
            expect(cert.score).to.equal(95);
        });

        it("Should fail if property does not exist", async function () {
            await expect(
                propertyNFT.connect(authorizedMinter).issueVastuCertificate(
                    999, 95, "A", "E", ethers.ZeroHash
                )
            ).to.be.revertedWith("Property does not exist");
        });
    });

    describe("Verification", function () {
        beforeEach(async function () {
            await propertyNFT.connect(authorizedMinter).registerProperty(
                user.address, "prop_123", "Addr", "City", "State", 100, 2000, "uri"
            );
        });

        it("Should allow owner to verify property", async function () {
            await propertyNFT.connect(owner).verifyProperty(1, true);
            const data = await propertyNFT.properties(1);
            expect(data.isVerified).to.be.true;
        });

        it("Should fail if non-owner tries to verify", async function () {
            await expect(
                propertyNFT.connect(user).verifyProperty(1, true)
            ).to.be.revertedWithCustomError(propertyNFT, "OwnableUnauthorizedAccount");
        });
    });
});
