const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { DAILY_FEE } = require("../../helper-hardhat-config");

module.exports = buildModule("Deploy", (m) => {
  const contract = m.contract("PositionManager", [
    process.env.PUBLIC_KEY,
    DAILY_FEE,
  ]);

  return { contract };
});