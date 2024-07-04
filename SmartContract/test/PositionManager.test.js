const { expect } = require("chai");
const { network, ethers } = require("hardhat");
const { DAILY_FEE } = require("../helper-hardhat-config");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {
  days,
} = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration");

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
  describe("Fee manager", () => {
    it("Changes a fee", async () => {
      const { positionManager } = await loadFixture(deployContractFixture);

      const newFee = ethers.parseEther("0.001");
      await positionManager.changeFee(newFee);

      expect(await positionManager.getDailyPositionFee()).to.equal(newFee);
    });
    it("Revertes changing a fee", async () => {
      const { positionManager, addr1 } = await loadFixture(
        deployContractFixture
      );

      const userConnected = positionManager.connect(addr1);
      const newFee = ethers.parseEther("0.001");

      await expect(userConnected.changeFee(newFee)).to.be.reverted;
    });
    it("Returns expected fee", async () => {
      const { positionManager, addr1 } = await loadFixture(
        deployContractFixture
      );

      const duration = 3; //days

      expect(await positionManager.getExpectedFee(duration)).to.equal(
        DAILY_FEE * duration
      );
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

    it("Creates a new position on UniswapV2", async () => {
      const { positionManager, owner, token1, token2, uniswapV2 } =
        await loadFixture(deployContractFixture);

      // Add liquidity
      await token1.approve(uniswapV2.target, ethers.parseEther("1"));
      await token2.approve(uniswapV2.target, ethers.parseEther("1"));
      await uniswapV2.addLiquidity(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        ethers.parseEther("1"),
        ethers.parseEther("1"),
        ethers.parseEther("1"),
        owner.address,
        Date.now()
      );

      const duration = 3; //days

      // Whitelist a dex router
      await positionManager.whitelistDexRouter(uniswapV2.target);

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Create position
      await token1.approve(positionManager.target, ethers.parseEther("1"));
      await positionManager.createPosition(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        "1",
        uniswapV2.target,
        duration,
        { value: expectedFee }
      );
      const blockTimestamp = (await ethers.provider.getBlock("latest"))
        .timestamp;

      const positionInfo = await positionManager.seePositionAttributes("0");

      expect(positionInfo[0]).to.equal(owner.address);
      expect(positionInfo[1]).to.equal(uniswapV2.target);
      expect(positionInfo[2]).to.equal(token1.target);
      expect(positionInfo[3]).to.equal(token2.target);
      expect(positionInfo[4]).to.equal(ethers.parseEther("1"));
      expect(positionInfo[5]).to.equal("1");
      expect(Number(positionInfo[6])).to.equal(blockTimestamp + 259200);
      expect(positionInfo[7]).to.equal("0");
      expect(positionInfo[8]).to.be.false;
      expect(positionInfo[9]).to.equal("1");
    });
    it("Creates a new position on UniswapV3", async () => {
      const { positionManager, owner, token1, token2, uniswapV3 } =
        await loadFixture(deployContractFixture);

      // Create pool
      await token1.approve(uniswapV3.target, ethers.parseEther("1"));
      await token2.approve(uniswapV3.target, ethers.parseEther("1"));

      await uniswapV3.createPool(token1.target, token2.target, "3000");

      const duration = 3; //days

      // Whitelist a dex router
      await positionManager.whitelistDexRouter(uniswapV3.target);

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Create position
      await token1.approve(positionManager.target, ethers.parseEther("1"));
      await positionManager.createPosition(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        "1",
        uniswapV3.target,
        duration,
        { value: expectedFee }
      );
      const blockTimestamp = (await ethers.provider.getBlock("latest"))
        .timestamp;

      const positionInfo = await positionManager.seePositionAttributes("0");

      expect(positionInfo[0]).to.equal(owner.address);
      expect(positionInfo[1]).to.equal(uniswapV3.target);
      expect(positionInfo[2]).to.equal(token1.target);
      expect(positionInfo[3]).to.equal(token2.target);
      expect(positionInfo[4]).to.equal(ethers.parseEther("1"));
      expect(positionInfo[5]).to.equal("1");
      expect(Number(positionInfo[6])).to.equal(blockTimestamp + 259200);
      expect(positionInfo[7]).to.equal("3000");
      expect(positionInfo[8]).to.be.false;
      expect(positionInfo[9]).to.equal("0");
    });
  });
});
