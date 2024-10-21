"use client";

import Dexes from "@/data/dexes.json";
import { useEffect, useState } from "react";
import { useForge } from "./ForgeContext";
import { ethers } from "ethers";
import Dex from "./Dex";

// Uniswap V2 Factory contract ABI
const UniswapV2FactoryABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
];

// Uniswap V3 Factory contract ABI
const UniswapV3FactoryABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
];

const UniswapRouterABI = ["function factory() external view returns (address)"];

const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL
);

export default function AvailableDexes() {
  const [dexes, setDexes] = useState<any[]>([]);

  const { inputToken, outputToken } = useForge();

  const getAvailableDexes = async () => {
    for (const dex of Dexes) {
      console.log(dex);
      if (dex.type === "V3") {
        const poolAddress = await getPoolAddress(
          dex.address,
          inputToken.address,
          outputToken.address
        );
        console.log(poolAddress, dex);
        if (
          poolAddress !== "0x0000000000000000000000000000000000000000" &&
          !dexes.some((d) => d.name === dex.name)
        ) {
          console.log("The pair is available on ", dex.name);
          setDexes((oldArray) => [...oldArray, dex]);
        }
      } else if (dex.type === "V2") {
        const poolAddress = await getPairAddress(
          dex.address,
          inputToken.address,
          outputToken.address
        );
        console.log(poolAddress, dex);
        if (
          poolAddress !== "0x0000000000000000000000000000000000000000" &&
          !dexes.some((d) => d.name === dex.name)
        ) {
          console.log("The pair is available on ", dex.name);
          setDexes((oldArray) => [...oldArray, dex]);
        }
      }
    }
  };

  async function getPoolAddress(
    routerAddress: string,
    tokenA: string,
    tokenB: string
  ) {
    try {
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

      const feeTiers = ["500", "1500", "3000"]; // Standard fee tiers in Uniswap V3
      let poolAddress = "0x0000000000000000000000000000000000000000";

      for (const fee of feeTiers) {
        console.log(
          `Trying fee tier: ${fee} for tokens ${tokenA} and ${tokenB}`
        );

        try {
          const address = await factoryContract.getPool(tokenA, tokenB, fee);

          console.log(`Pool address returned for fee tier ${fee}: ${address}`);

          if (address !== "0x0000000000000000000000000000000000000000") {
            poolAddress = address;
            break;
          }
        } catch (error) {
          console.error(`Error for fee tier ${fee}:`, error);
        }
      }

      return poolAddress;
    } catch (err) {
      console.error("Error fetching pool address:", err);
      return "0x0000000000000000000000000000000000000000";
    }
  }

  async function getPairAddress(
    routerAddress: string,
    tokenA: string,
    tokenB: string
  ) {
    try {
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
      return pairAddress;
    } catch (err) {
      console.error("Error fetching pool address:", err);
      return "0x0000000000000000000000000000000000000000";
    }
  }

  useEffect(() => {
    getAvailableDexes();
  }, []);

  useEffect(() => {
    console.log(dexes);
  }, [dexes]);

  return (
    <div className="flex flex-col">
      {dexes.length ? (
        dexes.map((dex, i) => <Dex dex={dex} key={i} />)
      ) : (
        <div>No pool available</div>
      )}
    </div>
  );
}
