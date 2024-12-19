const { expect } = require("chai");
const { ethers } = require("hardhat");
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
      expect(await positionManager.getExecutionFee()).to.equal(DAILY_FEE);
    });
  });
  describe("Fee manager", () => {
    it("Changes a fee", async () => {
      const { positionManager } = await loadFixture(deployContractFixture);

      const newFee = ethers.parseEther("0.001");
      await positionManager.changeDailyPositionFee(newFee);
      await positionManager.changeExecutionFee(newFee);

      expect(await positionManager.getDailyPositionFee()).to.equal(newFee);
      expect(await positionManager.getExecutionFee()).to.equal(newFee);
    });
    it("Revertes changing a fee", async () => {
      const { positionManager, addr1 } = await loadFixture(
        deployContractFixture
      );

      const userConnected = positionManager.connect(addr1);
      const newFee = ethers.parseEther("0.001");

      await expect(userConnected.changeDailyPositionFee(newFee)).to.be.reverted;
      await expect(userConnected.changeExecutionFee(newFee)).to.be.reverted;
    });
    it("Returns expected fee", async () => {
      const { positionManager } = await loadFixture(deployContractFixture);

      const duration = 3; //days

      expect(await positionManager.getExpectedFee(duration)).to.equal(
        Number(DAILY_FEE) + DAILY_FEE * duration
      );
    });
  });
  describe("Whitelist a uniswap router", () => {
    it("Should whitelist Uniswap V2 router", async () => {
      const { positionManager, uniswapV2 } = await loadFixture(
        deployContractFixture
      );

      // Whitelist the router
      await positionManager.whitelistDexRouter(uniswapV2.target, 1);

      // Verify whitelisting
      const dexInfo = await positionManager.whitelistedDexes(uniswapV2.target);
      expect(dexInfo[0]).to.be.true;
      expect(Number(dexInfo[1])).to.equal(1);
    });

    it("Should whitelist Uniswap V3 router", async () => {
      const { positionManager, uniswapV3 } = await loadFixture(
        deployContractFixture
      );

      // Whitelist the router
      await positionManager.whitelistDexRouter(uniswapV3.target, 0);

      // Verify whitelisting
      const dexInfo = await positionManager.whitelistedDexes(uniswapV3.target);
      expect(dexInfo[0]).to.be.true;
      expect(Number(dexInfo[1])).to.equal(0);
    });

    it("Should remove Dex from the whitelist", async () => {
      const { positionManager, uniswapV3 } = await loadFixture(
        deployContractFixture
      );

      // Whitelist the router
      await positionManager.whitelistDexRouter(uniswapV3.target, 0);

      // Verify whitelisting
      let dexInfo = await positionManager.whitelistedDexes(uniswapV3.target);
      expect(dexInfo[0]).to.be.true;
      expect(Number(dexInfo[1])).to.equal(0);

      // Remove the router from the whitelist
      await positionManager.removeDexRouter(uniswapV3.target);

      // Verify removal
      dexInfo = await positionManager.whitelistedDexes(uniswapV3.target);
      expect(dexInfo[0]).to.be.false;
    });
    it("Should revert when whitelisting if router is already whitelist", async () => {
      const { positionManager, uniswapV3 } = await loadFixture(
        deployContractFixture
      );

      // Whitelist the router
      await positionManager.whitelistDexRouter(uniswapV3.target, 0);

      // Revert if whitelisted
      await expect(
        positionManager.whitelistDexRouter(uniswapV3.target, 0)
      ).to.be.revertedWith("Dex router is already whitelisted");
    });
    it("Should revert when removing if the router is not on the whitelist", async () => {
      const { positionManager, uniswapV3 } = await loadFixture(
        deployContractFixture
      );

      // Remove from whitelist
      await expect(
        positionManager.removeDexRouter(uniswapV3.target)
      ).to.be.revertedWith("The dex is not on the whitelist");
    });
  });
  describe("Positions", () => {
    it("Reverts create position", async () => {
      const { positionManager, token1, token2, uniswapV2 } = await loadFixture(
        deployContractFixture
      );

      const duration = 3; //days

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Insufficient fee
      await expect(
        positionManager.createPosition(
          token1.target,
          token2.target,
          ethers.parseEther("1"),
          "1",
          uniswapV2.target,
          duration,
          0,
          { value: "1" }
        )
      ).to.be.revertedWith("Insufficient fee");

      // Insufficient token balance
      await expect(
        positionManager.createPosition(
          token1.target,
          token2.target,
          ethers.parseEther("1000000"),
          "1",
          uniswapV2.target,
          duration,
          0,
          { value: expectedFee }
        )
      ).to.be.revertedWith("Insufficient token balance");

      // Address not whitelisted
      await expect(
        positionManager.createPosition(
          token1.target,
          token2.target,
          ethers.parseEther("1"),
          "1",
          uniswapV2.target,
          duration,
          0,
          { value: expectedFee }
        )
      ).to.be.revertedWith("Dex router not whitelisted");

      // Whitelist address
      await positionManager.whitelistDexRouter(uniswapV2.target, 1);

      // Desired pool doesn't exist
      await expect(
        positionManager.createPosition(
          token1.target,
          token2.target,
          ethers.parseEther("1"),
          "1",
          uniswapV2.target,
          duration,
          0,
          { value: expectedFee }
        )
      ).to.be.revertedWith("The pool doesn't exist");
    });
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
      await positionManager.whitelistDexRouter(uniswapV2.target, 1);

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Balance before position
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("999")
      );
      expect(await token1.balanceOf(positionManager.target)).to.equal(
        ethers.parseEther("0")
      );

      // Create position
      await token1.approve(positionManager.target, ethers.parseEther("1"));
      await positionManager.createPosition(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        "1",
        uniswapV2.target,
        duration,
        0,
        { value: expectedFee }
      );

      // Tests
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
      expect(positionInfo[9]).to.equal("0");
      expect(positionInfo[10]).to.equal("1");
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("998")
      );
      expect(await token1.balanceOf(positionManager.target)).to.equal(
        ethers.parseEther("1")
      );
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
      await positionManager.whitelistDexRouter(uniswapV3.target, 0);

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Balance before position
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("1000")
      );
      expect(await token1.balanceOf(positionManager.target)).to.equal(
        ethers.parseEther("0")
      );

      // Create position
      await token1.approve(positionManager.target, ethers.parseEther("1"));
      await positionManager.createPosition(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        "1",
        uniswapV3.target,
        duration,
        0,
        { value: expectedFee }
      );

      // Tests
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
      expect(positionInfo[10]).to.equal("0");
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("999")
      );
      expect(await token1.balanceOf(positionManager.target)).to.equal(
        ethers.parseEther("1")
      );
    });
    it("User prolongs position", async () => {
      const { positionManager, owner, token1, token2, uniswapV3, addr1 } =
        await loadFixture(deployContractFixture);

      // Create pool
      await token1.approve(uniswapV3.target, ethers.parseEther("1"));
      await token2.approve(uniswapV3.target, ethers.parseEther("1"));

      await uniswapV3.createPool(token1.target, token2.target, "3000");

      const duration = 3; //days

      // Whitelist a dex router
      await positionManager.whitelistDexRouter(uniswapV3.target, 0);

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
        0,
        { value: expectedFee }
      );

      const blockTimestamp = (await ethers.provider.getBlock("latest"))
        .timestamp;

      // Prolongs position
      await positionManager.prolongPosition("0", duration, {
        value: expectedFee,
      });

      // Tests
      const positionInfo = await positionManager.seePositionAttributes("0");

      expect(Number(positionInfo[6])).to.equal(blockTimestamp + 259200 * 2);
      await expect(positionManager.prolongPosition("0", 3)).to.be.revertedWith(
        "Insufficient fee"
      );
      await expect(
        positionManager.connect(addr1).prolongPosition("0", 3)
      ).to.be.revertedWith("Not the position owner");
    });
    it("Withdraws position", async () => {
      const { positionManager, owner, token1, token2, uniswapV3, addr1 } =
        await loadFixture(deployContractFixture);

      // Create pool
      await token1.approve(uniswapV3.target, ethers.parseEther("1"));
      await token2.approve(uniswapV3.target, ethers.parseEther("1"));

      await uniswapV3.createPool(token1.target, token2.target, "3000");

      const duration = 3; //days

      // Whitelist a dex router
      await positionManager.whitelistDexRouter(uniswapV3.target, 0);

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
        0,
        { value: expectedFee }
      );

      await positionManager.withdrawPosition("0");

      // Tests
      const positionInfo = await positionManager.seePositionAttributes("0");

      expect(await token1.balanceOf(positionManager.target)).to.equal("0");
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("1000")
      );
      expect(positionInfo[8]).to.be.true;
      await expect(positionManager.withdrawPosition("0")).to.be.revertedWith(
        "Position already executed"
      );
      await expect(
        positionManager.connect(addr1).withdrawPosition("0")
      ).to.be.revertedWith("Not the position owner");
    });
  });
  describe("Executes swap", () => {
    it("Swap execution with UniswapV3", async () => {
      const { positionManager, uniswapV3, token1, token2 } = await loadFixture(
        deployContractFixture
      );

      // Create pool
      await token1.approve(uniswapV3.target, ethers.parseEther("1"));
      await token2.approve(uniswapV3.target, ethers.parseEther("1"));

      await uniswapV3.createPool(token1.target, token2.target, "3000");

      await uniswapV3.addLiquidity(
        token1.target,
        token2.target,
        "3000",
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      const duration = 3; //days

      // Whitelist a dex router
      await positionManager.whitelistDexRouter(uniswapV3.target, 0);

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
        0,
        { value: expectedFee }
      );

      // Perform swap execution
      await positionManager.executeSwap("0");

      // Tests
      const positionInfo = await positionManager.seePositionAttributes("0");

      expect(await token1.balanceOf(positionManager.target)).to.equal("0");
      expect(await token2.balanceOf(positionManager.target)).to.equal("0");
      expect(positionInfo[8]).to.be.true;
    });
    it("Swap execution with UniswapV2", async () => {
      const { positionManager, uniswapV2, token1, token2, owner } =
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
      await positionManager.whitelistDexRouter(uniswapV2.target, 1);

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Balance before position
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("999")
      );
      expect(await token1.balanceOf(positionManager.target)).to.equal(
        ethers.parseEther("0")
      );

      // Create position
      await token1.approve(positionManager.target, ethers.parseEther("1"));
      await positionManager.createPosition(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        "1",
        uniswapV2.target,
        duration,
        0,
        { value: expectedFee }
      );

      // Perform swap execution
      await positionManager.executeSwap("0");

      // Tests
      const positionInfo = await positionManager.seePositionAttributes("0");

      expect(await token1.balanceOf(positionManager.target)).to.equal("0");
      expect(await token2.balanceOf(positionManager.target)).to.equal("0");
      expect(positionInfo[8]).to.be.true;
    });
    it("Reverts swap execution", async () => {
      const { positionManager, uniswapV2, token1, token2, owner, addr1 } =
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
      await positionManager.whitelistDexRouter(uniswapV2.target, 1);

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Balance before position
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("999")
      );
      expect(await token1.balanceOf(positionManager.target)).to.equal(
        ethers.parseEther("0")
      );

      // Create position
      await token1.approve(positionManager.target, ethers.parseEther("1"));
      await positionManager.createPosition(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        "1",
        uniswapV2.target,
        duration,
        0,
        { value: expectedFee }
      );

      // Perform swap execution
      await positionManager.executeSwap("0");

      // Tests
      await expect(positionManager.executeSwap("0")).to.be.revertedWith(
        "Position already executed"
      );
      await expect(
        positionManager.connect(addr1).executeSwap("0")
      ).to.be.revertedWith("Only trade executor can execute swap");
    });
    it("Changes trade executor", async () => {
      const { positionManager, uniswapV2, token1, token2, owner, addr1 } =
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
      await positionManager.whitelistDexRouter(uniswapV2.target, 1);

      const expectedFee = await positionManager.getExpectedFee(duration);

      // Balance before position
      expect(await token1.balanceOf(owner.address)).to.equal(
        ethers.parseEther("999")
      );
      expect(await token1.balanceOf(positionManager.target)).to.equal(
        ethers.parseEther("0")
      );

      // Create position
      await token1.approve(positionManager.target, ethers.parseEther("1"));
      await positionManager.createPosition(
        token1.target,
        token2.target,
        ethers.parseEther("1"),
        "1",
        uniswapV2.target,
        duration,
        0,
        { value: expectedFee }
      );

      // Changing the trade executor
      await positionManager.setNewTradeExecutor(addr1.address);

      // Tests
      await expect(positionManager.executeSwap("0")).to.be.revertedWith(
        "Only trade executor can execute swap"
      );
    });
  });
});
