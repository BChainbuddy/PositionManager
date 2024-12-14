const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { DAILY_FEE } = require("../../helper-hardhat-config");

module.exports = buildModule("Deploy", (m) => {
  const contract = m.contract("PositionManager", [
    process.env.PUBLIC_KEY,
    DAILY_FEE,
    DAILY_FEE,
  ]);

  return { contract };
});

//command
//npx hardhat ignition deploy ignition/modules/Deploy.js --network sepolia --verify
//npx hardhat verify --network sepolia 0x0C317c7fD3670B21Ae6Bd407cA7C7531611E6f35 10000000000000 10000000000000
