const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { DAILY_FEE } = require("../../helper-hardhat-config");

module.exports = buildModule("Deploy", (m) => {
  const contract = m.contract("PositionManager", [
    "0xA9774e31e68c1a0C9507e942692305eb8c3B32AE",
    DAILY_FEE,
  ]);

  return { contract };
});
