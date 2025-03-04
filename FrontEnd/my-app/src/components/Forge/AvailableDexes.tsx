"use client";

import Dexes from "@/data/dexes.json";
import { useEffect, useState } from "react";
import { useForge } from "../../context/ForgeContext";
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
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
);

interface AvailableDexesProps {
  automatic: boolean;
  step: number;
}

export default function AvailableDexes({
  automatic,
  step,
}: AvailableDexesProps) {
  const [dexes, setDexes] = useState<any[]>([]);

  const { inputToken, outputToken, setDex } = useForge();

  const getAvailableDexes = async () => {
    for (const dex of Dexes) {
      if (dex.type === "V3") {
        const feeTier = await getPoolAddress(
          dex.address,
          inputToken.address,
          outputToken.address
        );
        console.log(feeTier, dex);
        if (feeTier != "0") {
          console.log("The pair is available on ", dex.name);
          let dexWithFee: any = dex;
          console.log("THIS IS WHAT THE FEE TIER SHOULD BE", feeTier);
          dexWithFee.fee = feeTier;
          setDexes((oldArray) => [...oldArray, dexWithFee]);
        }
      } else if (dex.type === "V2") {
        const poolAddress = await getPairAddress(
          dex.address,
          inputToken.address,
          outputToken.address
        );
        // console.log(poolAddress, dex);
        if (poolAddress !== "0x0000000000000000000000000000000000000000") {
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
            return fee;
          }
        } catch (error) {
          console.error(`Error for fee tier ${fee}:`, error);
        }
      }

      return 0;
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
      console.error("Error fetching pair address:", err);
      return "0x0000000000000000000000000000000000000000";
    }
  }

  useEffect(() => {
    setDexes([]);
    setDex("");
    getAvailableDexes();
  }, [inputToken, outputToken]);

  useEffect(() => {
    if (automatic && dexes.length) {
      setDex(dexes[0]);
    }
  }, [automatic, dexes]);

  return (
    <div
      className={`dexGrid mt-6 transition-all duration-1000 ${
        automatic && "grayscale disabled"
      }`}
    >
      {dexes.length ? (
        dexes.map((dex, i) => (
          <Dex dexInfo={dex} key={i} automatic={automatic} />
        ))
      ) : (
        <div>No pool available</div>
      )}
    </div>
  );
}
