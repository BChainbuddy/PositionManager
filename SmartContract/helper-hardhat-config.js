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
const INITIAL_PRICE = "200000000000000000000";
const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
};
