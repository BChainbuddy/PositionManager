const { expect } = require("chai");
const { network, ethers } = require("hardhat");
const { DAILY_FEE } = require("../helper-hardhat-config");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("PositionManager", () => {
  async function deployContractFixture() {
    // Get the Signers here.
    const [owner, addr1] = await ethers.getSigners();

    const positionManager = await ethers.deployContract("PositionManager", [
      owner.address,
      DAILY_FEE,
    ]);

    await positionManager.waitForDeployment();

    const token1 = await ethers.deployContract("Token", ["DogeCoin", "DOGE"]);

    await token1.waitForDeployment();

    const token2 = await ethers.deployContract("Token", ["ShibaInu", "SHIB"]);

    await token2.waitForDeployment();

    const uniswapV2 = await ethers.deployContract("MockUniswapV2Router");

    await uniswapV2.waitForDeployment();

    const uniswapV3 = await ethers.deployContract("MockUniswapV3Router");

    await uniswapV3.waitForDeployment();

    const quantity = ethers.parseEther("100");

    return {
      positionManager,
      owner,
      addr1,
      token1,
      token2,
      quantity,
      uniswapV2,
      uniswapV3,
    };
  }
  describe("Initial check", () => {
    it("Sets an owner, trade executor and daily fee", async () => {
      const { positionManager, owner } = await loadFixture(
        deployContractFixture
      );
      expect(await positionManager.owner()).to.equal(owner.address);
      expect(await positionManager.getDailyPositionFee()).to.equal(DAILY_FEE);
    });
  });
  describe("Whitelist a uniswap router!", () => {
    it("Whitelisted", async () => {
      const { positionManager, uniswapV2, uniswapV3 } = await loadFixture(
        deployContractFixture
      );
      // await positionManager.whitelistDexRouter(uniswapV2.target);
      // function swapExactTokensForTokens(
      //   uint256 amountIn,
      //   uint256 amountOutMin,
      //   address[] calldata path,
      //   address to,
      //   uint256 deadline
      await uniswapV2.swapExactTokensForTokens(
        "100",
        "100",
        ["0x"],
        "0x",
        "100"
      );
      // await positionManager.whitelistDexRouter(uniswapV2.target);
    });
    it("Contract not a uniswap v3 or v2 fork", async () => {
      const { positionManager, uniswapV2, uniswapV3 } = await loadFixture(
        deployContractFixture
      );
      // positionManager.whitelistDexRouter(positionManager.address);
    });
  });
  describe("Positions", () => {
    //   function createPosition(
    //     address tokenIn,
    //     address tokenOut,
    //     uint256 quantity,
    //     uint256 swapPrice,
    //     address dexRouter,
    //     uint32 duration
    // ) external payable nonReentrant
    it("Creates a new position", async () => {
      const { positionManager, owner, addr1, token1, token2, quantity } =
        await loadFixture(deployContractFixture);
    });
  });
});
