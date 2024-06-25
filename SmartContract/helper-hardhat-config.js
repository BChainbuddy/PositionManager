const { ethers } = require("hardhat");

const networkConfig = {
  default: {
    name: "hardhat",
  },
  11155111: {
    name: "sepolia",
  },
  5: {
    name: "goerli",
  },
  31337: {
    name: "localhost",
  },
  mocha: {
    timeout: 200000,
  },
};

const DECIMALS = "18";
const DAILY_FEE = "1000000000000000";
const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  DAILY_FEE,
};
