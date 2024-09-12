const { ethers } = require("ethers");
require("dotenv").config();

// Connect to Ethereum node
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Uniswap V2 Factory contract ABI
const UniswapV2FactoryABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];

// Uniswap V2 Pair contract ABI
const UniswapV2PairABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
];

// Uniswap V3 Factory contract ABI
const UniswapV3FactoryABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
];

// Uniswap V3 Pool contract ABI
const UniswapV3PoolABI = [
  "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
];

const UniswapRouterABI = ["function factory() external view returns (address)"];

// Function to get pair address
async function getPairAddress(routerAddress, tokenA, tokenB) {
  const routerContract = new ethers.Contract(
    routerAddress,
    UniswapRouterABI,
    provider
  );
  const factoryAddress = await routerContract.factory();
  const factoryContract = new ethers.Contract(
    factoryAddress,
    UniswapV2FactoryABI,
    provider
  );
  const pairAddress = await factoryContract.getPair(tokenA, tokenB);
  if (pairAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Pair not found for the provided token addresses.");
  }
  return pairAddress;
}

// Function to fetch the price
async function getV2Price(routerAddress, tokenAddress1, tokenAddress2) {
  const pairAddress = await getPairAddress(
    routerAddress,
    tokenAddress1,
    tokenAddress2
  );
  const pairContract = new ethers.Contract(
    pairAddress,
    UniswapV2PairABI,
    provider
  );
  try {
    const reserves = await pairContract.getReserves();
    const reserve0 = ethers.formatUnits(reserves[0], 18); // Assuming token0 has 18 decimals
    const reserve1 = ethers.formatUnits(reserves[1], 18); // Adjust decimals as needed

    console.log(reserve0);
    console.log(reserve1);
    console.log(reserves);

    const price = reserve0 / reserve1;
    console.log(`Uniswap V2 Price: ${price}`);
  } catch (error) {
    console.error("Error fetching reserves:", error);
  }
}

// Function to get pool address
async function getPoolAddress(routerAddress, tokenA, tokenB, fee) {
  const routerContract = new ethers.Contract(
    routerAddress,
    UniswapRouterABI,
    provider
  );
  const factoryAddress = await routerContract.factory();
  const factoryContract = new ethers.Contract(
    factoryAddress,
    UniswapV3FactoryABI,
    provider
  );
  const poolAddress = await factoryContract.getPool(tokenA, tokenB, fee);
  if (poolAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error(
      "Pool not found for the provided token addresses and fee tier."
    );
  }
  return poolAddress;
}

// Function to fetch the price
async function getV3Price(routerAddress, tokenAddress1, tokenAddress2, fee) {
  const poolAddress = await getPoolAddress(
    routerAddress,
    tokenAddress1,
    tokenAddress2,
    fee
  );
  const poolContract = new ethers.Contract(
    poolAddress,
    UniswapV3PoolABI,
    provider
  );
  try {
    const slot0 = await poolContract.slot0();
    const sqrtPriceX96 = slot0.sqrtPriceX96;

    // Calculate price
    const price = (sqrtPriceX96 / 2 ** 96) ** 2;
    console.log(`Uniswap V3 Price: ${price}`);
  } catch (error) {
    console.error("Error fetching slot0 data:", error);
  }
}

module.exports = { getV2Price, getV3Price };
