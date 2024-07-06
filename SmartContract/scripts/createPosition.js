const { ethers } = require("hardhat");

let deployer;

ethers
  .getSigners()
  .then(([owner]) => {
    deployer = owner;
  })
  .catch((error) => {
    console.error(error);
  });
  
async function createPosition(
  tokenAddress1,
  tokenAddress2,
  quantity,
  swapPrice,
  dexRouter,
  duration
) {
  console.log("Connecting to the contracts...");

  const PositionManager = await ethers.getContract("PositionManager", deployer);
  const token1 = await ethers.getContractAt("Token", tokenAddress1, deployer);
  console.log(`This is the Position Manager address ${swapRouter.target}`);
  console.log("Connected to the contract!");

  // Approve token in
  console.log(`Approving tokens...`);
  const approveTx = await token1.approve(
    PositionManager.target,
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

createPosition(deployer, deployer, ethers.parseEther("1"), "1", deployer, "3")
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
