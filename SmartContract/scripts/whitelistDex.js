const { ethers } = require("hardhat");

async function main(positionManagerAddress, dexAddress) {
  // Get the deployer
  const [owner] = await ethers.getSigners();
  deployer = owner;

  // Call whitelistDex
  await whitelistDex(positionManagerAddress, dexAddress);
}

async function whitelistDex(positionManagerAddress, dexAddress) {
  console.log("Connecting to the contracts...");
  const PositionManager = await ethers.getContractAt(
    "PositionManager",
    positionManagerAddress,
    deployer
  );
  // console.log("Checking if the dex has already been whitelisted...");
  // console.log(await PositionManager.whitelistedDexes(dexAddress));
  console.log("Whitelisting a dex...");
  const tx = await PositionManager.whitelistDexRouter(dexAddress);
  await tx.wait(1);
  console.log(`Dex ${dexAddress} successfuly whitelisted!`);
}

main(
  "0xA754cdbc3fF6ACDb2FB2c323e0017d9cE2f7EcB4",
  "0xF3FAcb8B17597625487E6CBCF8C022797c555177"
)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

