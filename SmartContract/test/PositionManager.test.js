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

    const mockContract = await ethers.deployContract("MockContract");

    await mockContract.waitForDeployment();

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
      mockContract,
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
  describe("Whitelist a uniswap router", () => {
    it("Revert address is a wallet", async () => {
      const { positionManager, owner } = await loadFixture(
        deployContractFixture
      );

      // Check if the address is a valid Uniswap fork
      await expect(positionManager.isValidUniswapFork(owner.address)).to.be
        .reverted;

      // Whitelist the address
      await expect(positionManager.whitelistDexRouter(owner.address)).to.be
        .reverted;

      // Verify whitelisting
      const dexInfo = await positionManager.whitelistedDexes(owner.address);
      expect(dexInfo[0]).to.be.false;
      expect(Number(dexInfo[1])).to.equal(0);
    });
    it("Should whitelist Uniswap V2 router", async () => {
      const { positionManager, uniswapV2 } = await loadFixture(
        deployContractFixture
      );
      // Check if the router is a valid Uniswap V2 fork
      const dexType = await positionManager.isValidUniswapFork(
        uniswapV2.target
      );
      expect(Number(dexType)).to.equal(1); // 0 corresponds to UniswapABI.V2

      // Whitelist the router
      await positionManager.whitelistDexRouter(uniswapV2.target);

      // Verify whitelisting
      const dexInfo = await positionManager.whitelistedDexes(uniswapV2.target);
      expect(dexInfo[0]).to.be.true;
      expect(Number(dexInfo[1])).to.equal(1);
    });

    it("Should whitelist Uniswap V3 router", async () => {
      const { positionManager, uniswapV3 } = await loadFixture(
        deployContractFixture
      );

      // Check if the router is a valid Uniswap V3 fork
      const dexType = await positionManager.isValidUniswapFork(
        uniswapV3.target
      );
      expect(Number(dexType)).to.equal(0); // 1 corresponds to UniswapABI.V3

      // Whitelist the router
      await positionManager.whitelistDexRouter(uniswapV3.target);

      // Verify whitelisting
      const dexInfo = await positionManager.whitelistedDexes(uniswapV3.target);
      expect(dexInfo[0]).to.be.true;
      expect(Number(dexInfo[1])).to.equal(0);
    });

    it("Should revert because the contract doesnt include V2 or V3 interface", async () => {
      const { positionManager, mockContract } = await loadFixture(
        deployContractFixture
      );

      // Check if the address is a valid Uniswap fork
      await expect(positionManager.isValidUniswapFork(mockContract.target)).to
        .be.reverted;

      // Whitelist the address
      await expect(positionManager.whitelistDexRouter(mockContract.target)).to
        .be.reverted;

      // Verify whitelisting
      const dexInfo = await positionManager.whitelistedDexes(
        mockContract.target
      );
      expect(dexInfo[0]).to.be.false;
      expect(Number(dexInfo[1])).to.equal(0);
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
