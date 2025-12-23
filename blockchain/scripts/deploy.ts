import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Deploy Property NFT
    console.log("\n📦 Deploying RestInUPropertyNFT...");
    const PropertyNFT = await ethers.getContractFactory("RestInUPropertyNFT");
    const propertyNFT = await PropertyNFT.deploy();
    await propertyNFT.waitForDeployment();
    const propertyNFTAddress = await propertyNFT.getAddress();
    console.log("✅ RestInUPropertyNFT deployed to:", propertyNFTAddress);

    // Deploy Fractional NFT
    console.log("\n📦 Deploying RestInUFractionalNFT...");
    const FractionalNFT = await ethers.getContractFactory("RestInUFractionalNFT");
    const fractionalNFT = await FractionalNFT.deploy();
    await fractionalNFT.waitForDeployment();
    const fractionalNFTAddress = await fractionalNFT.getAddress();
    console.log("✅ RestInUFractionalNFT deployed to:", fractionalNFTAddress);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 Deployment Complete!");
    console.log("=".repeat(50));
    console.log("\nContract Addresses:");
    console.log(`  PropertyNFT:   ${propertyNFTAddress}`);
    console.log(`  FractionalNFT: ${fractionalNFTAddress}`);
    console.log("\nAdd these to your .env file:");
    console.log(`PROPERTY_NFT_CONTRACT=${propertyNFTAddress}`);
    console.log(`FRACTIONAL_NFT_CONTRACT=${fractionalNFTAddress}`);

    // Verify contracts on Polygonscan (if not local)
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== 31337n) {
        console.log("\n🔍 Waiting for block confirmations before verification...");
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute

        console.log("Verifying contracts on Polygonscan...");
        try {
            const { run } = await import("hardhat");
            await run("verify:verify", { address: propertyNFTAddress, constructorArguments: [] });
            await run("verify:verify", { address: fractionalNFTAddress, constructorArguments: [] });
            console.log("✅ Contracts verified!");
        } catch (error) {
            console.log("⚠️ Verification failed:", error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

