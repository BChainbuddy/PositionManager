const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { DAILY_FEE } = require("../../helper-hardhat-config");

module.exports = buildModule("DeployDexV3", (m) => {
  const contract = m.contract("MockUniswapV3Router", []);

  return { contract };
});

//command
//npx hardhat ignition deploy ignition/modules/DeployDex.js --network sepolia --verify
//npx hardhat verify --network polygonAmoy 0x449D1610204D666cf0B5f820F3c31A5A1A20FAe6 0xA9774e31e68c1a0C9507e942692305eb8c3B32AE 1000000000000000 1000000000000000
