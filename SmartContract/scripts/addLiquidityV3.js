const { ethers } = require("hardhat");

async function main(
  dexRouter,
  token1Address,
  token2Address,
  amountToken1,
  amountToken2
) {
  // Get the deployer
  const [owner] = await ethers.getSigners();
  deployer = owner;

  // Call whitelistDex
  addLiquidity(
    dexRouter,
    token1Address,
    token2Address,
    amountToken1,
    amountToken2
  );
}

async function addLiquidity(
  dexRouter,
  token1Address,
  token2Address,
  amountToken1,
  amountToken2
) {
  console.log("Connecting to the contracts...");
  const DexRouter = await ethers.getContractAt(
    "MockUniswapV3Router",
    dexRouter,
    deployer
  );
  const token1 = await ethers.getContractAt("Token", token1Address, deployer);
  const token2 = await ethers.getContractAt("Token", token2Address, deployer);

  console.log("Approving tokens...");
  const approve1 = await token1.approve(
    DexRouter.target,
    ethers.parseEther(amountToken1)
  );
  await approve1.wait(1);
  const approve2 = await token2.approve(
    DexRouter.target,
    ethers.parseEther(amountToken2)
  );
  await approve2.wait(1);
  console.log("Tokens approved!");
  console.log("Adding liquidity...");
  const add = await DexRouter.createPool(token1.target, token2.target, "3000");
  await add.wait(1);
  console.log("Liquidity added!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
