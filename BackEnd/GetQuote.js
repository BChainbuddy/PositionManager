const { ethers } = require("ethers");
require("dotenv").config();

// Connect to Ethereum node
const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL
);

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
    const reserve0 = ethers.formatUnits(reserves[0].toString(), 18); // Assuming token0 has 18 decimals
    const reserve1 = ethers.formatUnits(reserves[1].toString(), 18); // Adjust decimals as needed

    console.log(reserve0);
    console.log(reserve1);
    console.log(reserves);

    const price = Number(reserve0) / Number(reserve1);
    console.log(`Uniswap V2 Price: ${price}`);
    return price;
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
  console.log(factoryAddress);
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
async function getV3Price(
  routerAddress,
  tokenAddress1,
  tokenAddress2,
  fee,
  decimalsIn,
  decimalsOut
) {
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
    let price;
    let orientationFirst;
    if (tokenAddress1.toLowerCase() < tokenAddress2.toLowerCase()) {
      orientationFirst = tokenAddress1;
    } else {
      orientationFirst = tokenAddress2;
    }

    if (orientationFirst == tokenAddress1) {
      price = (Number(sqrtPriceX96) / 2 ** 96) ** 2;
      price = price * 10 ** (decimalsIn - decimalsOut);
    } else {
      price = 1 / (Number(sqrtPriceX96) / 2 ** 96) ** 2;
      price = price * 10 ** (decimalsIn - decimalsOut);
    }

    console.log(price);
    return price;
  } catch (error) {
    console.error("Error fetching slot0 data:", error);
  }
}

getV3Price(
  "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
  3000,
  6,
  18
);

// wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
//       dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
//       tokenOut: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
//       tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
//       quantity: 100000000000000000000,
//       executionValue: 5000000000000000000,
//       endTimestamp: 1730313600,
//       fee: "3000",
//       executed: false,
//       forkABI: 1,

// tokenOut: "0xe5b49820e5a1063f6f4ddf851327b5e8b2301048",
//       tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",

module.exports = { getV2Price, getV3Price };

// if (orientationFirst == tokenAddress1) {
//   price = (Number(sqrtPriceX96) / 2 ** 96) ** 2;
//   price = price * 10 ** (decimalsIn - decimalsOut);
// } else {
//   price = 1 / (Number(sqrtPriceX96) / 2 ** 96) ** 2;
//   price = price * 10 ** (decimalsIn - decimalsOut);
// }
