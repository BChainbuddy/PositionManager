const { ethers } = require("ethers");

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
async function getPairAddress(routerAddress: any, tokenA: any, tokenB: any) {
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
export async function getV2Price(
  routerAddress: string,
  tokenAddress1: string,
  tokenAddress2: string,
  decimalsIn: number,
  decimalsOut: number
) {
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
    const { reserve0, reserve1 } = await pairContract.getReserves();

    // Determine token order and calculate price accordingly
    let price;
    if (tokenAddress1.toLowerCase() < tokenAddress2.toLowerCase()) {
      price = (reserve1 / reserve0) * 10 ** (decimalsIn - decimalsOut);
    } else {
      price = (reserve0 / reserve1) * 10 ** (decimalsOut - decimalsIn);
    }

    console.log(`Uniswap V2 Price: ${price}`);
    return price;
  } catch (error) {
    console.error("Error fetching reserves:", error);
  }
}

// Function to get pool address
async function getPoolAddress(
  routerAddress: any,
  tokenA: any,
  tokenB: any,
  fee: any
) {
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
export async function getV3Price(
  routerAddress: any,
  tokenAddress1: any,
  tokenAddress2: any,
  fee: any,
  decimalsIn: number,
  decimalsOut: number
) {
  try {
    const poolAddress = await getPoolAddress(
      routerAddress,
      tokenAddress1,
      tokenAddress2,
      fee
    );

    if (!poolAddress) return null;

    const poolContract = new ethers.Contract(
      poolAddress,
      UniswapV3PoolABI,
      provider
    );
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

    return price;
  } catch (error) {
    console.error("Error fetching V3 price:", error);
  }
}
