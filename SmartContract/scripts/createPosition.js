const { ethers } = require("hardhat");

let deployer;

async function main(positionManagerAddress) {
  // Get the deployer
  const [owner] = await ethers.getSigners();
  deployer = owner;

  // Call createPosition
  await createPosition(positionManagerAddress, "0x", "0x", ethers.parseEther("1"), "1", "0x", "3");
}

async function createPosition(
  positionManagerAddress,
  tokenAddress1,
  tokenAddress2,
  quantity,
  swapPrice,
  dexRouter,
  duration
) {

  console.log("ADDRESS: ", positionManagerAddress);
  console.log("Connecting to the contracts...");

  const PositionManager = await ethers.getContractAt(
    "PositionManager",
    positionManagerAddress,
    deployer
  );

  console.log("HERE!");
  const token1 = await ethers.getContractAt("Token", tokenAddress1, deployer);
  console.log(`This is the Position Manager address ${positionManagerAddress}`);
  console.log("Connected to the contract!");

  // Approve token in
  console.log(`Approving tokens...`);
  const approveTx = await token1.approve(
    positionManagerAddress,
    ethers.parseEther("1")
  );
  await approveTx.wait(1);
  console.log(`Tokens approved!`);

  // Retrieving fee amount
  console.log("Calculating the fee...");
  const expectedFee = await PositionManager.expectedFee(duration);
  console.log(
    `The fee is ${expectedFee} WEI or ${Number(expectedFee) / 10 ** 18} ETH`
  );

  // Create position
  console.log("Creating position...");
  const createTx = await PositionManager.createPosition(
    tokenAddress1,
    tokenAddress2,
    quantity,
    swapPrice,
    dexRouter,
    duration,
    { value: expectedFee }
  );
  await createTx.wait();
  console.log("Position Created!");
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
