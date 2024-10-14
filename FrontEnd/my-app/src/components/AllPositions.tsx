"use client";

import { useEffect, useState } from "react";
import CoinList from "@/data/coinlist.json";
import OpenPosition from "./OpenPosition";
import { price } from "@/lib/price";
import UserPosition from "./UserPosition";

export interface Position {
  wallet: string;
  dexRouter: string;
  tokenIn: string;
  tokenOut: string;
  quantity: number;
  executionValue: number;
  endTimestamp: number;
  fee: string;
  executed: boolean;
  forkABI: number;
  symbolIn?: string;
  symbolOut?: string;
  nameIn?: string;
  nameOut?: string;
  decimalsIn?: number;
  decimalsOut?: number;
  imgIn?: string;
  imgOut?: string;
  price?: number;
}

export default function AllPosition() {
  const [positions, setPositions] = useState<any[]>([]);

  // Mock call to conract, since it is on testnet and
  // doesnt have addresses that are recognised coingecko

  const mockPositions: Position[] = [
    {
      // CHAINLINK/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 5000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // AAVE/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 400000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // RENDER/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x61299774020da444af134c82fa83e3810b309991",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // GRT/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x5fe2b58c013d7601147dcdd68c143a77499f5531",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "500",
      executed: false,
      forkABI: 1,
    },
    {
      // MKR/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x6f7c932e7684666c9fd1d44527765433e01ff61d",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // BONK/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0xe5b49820e5a1063f6f4ddf851327b5e8b2301048",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // CHAINLINK/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 5000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // AAVE/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 400000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // RENDER/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x61299774020da444af134c82fa83e3810b309991",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // GRT/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x5fe2b58c013d7601147dcdd68c143a77499f5531",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "500",
      executed: false,
      forkABI: 1,
    },
    {
      // MKR/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x6f7c932e7684666c9fd1d44527765433e01ff61d",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // BONK/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0xe5b49820e5a1063f6f4ddf851327b5e8b2301048",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // MKR/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x6f7c932e7684666c9fd1d44527765433e01ff61d",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // BONK/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0xe5b49820e5a1063f6f4ddf851327b5e8b2301048",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // MKR/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0x6f7c932e7684666c9fd1d44527765433e01ff61d",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // BONK/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0xe5b49820e5a1063f6f4ddf851327b5e8b2301048",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // AAVE/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenOut: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
      tokenIn: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 400000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
  ];

  const addTokenData = async () => {
    const updatedPositions = await Promise.all(
      mockPositions.map(async (position) => {
        const foundTokenIn = CoinList.tokens.find(
          (element) => element.address === position.tokenIn
        );
        const foundTokenOut = CoinList.tokens.find(
          (element) => element.address === position.tokenOut
        );

        return {
          ...position,
          symbolIn: foundTokenIn ? foundTokenIn.symbol : "",
          symbolOut: foundTokenOut ? foundTokenOut.symbol : "",
          nameIn: foundTokenIn ? foundTokenIn.name : "",
          nameOut: foundTokenOut ? foundTokenOut.name : "",
          decimalsIn: foundTokenIn ? foundTokenIn.decimals : "",
          decimalsOut: foundTokenOut ? foundTokenOut.decimals : "",
          imgIn: foundTokenIn
            ? foundTokenIn?.logoURI?.replace("thumb", "large")
            : "",
          imgOut: foundTokenOut
            ? foundTokenOut?.logoURI?.replace("thumb", "large")
            : "",
          price: await price(
            position.tokenIn,
            position.tokenOut,
            position.dexRouter,
            position.forkABI,
            position.fee,
            foundTokenIn ? foundTokenIn.decimals : 0,
            foundTokenOut ? foundTokenOut.decimals : 0
          ),
        };
      })
    );

    setPositions(updatedPositions);
  };

  useEffect(() => {
    addTokenData();
  }, []);

  return (
    <div className="allPositionsGrid w-full mt-4 border-4 border-[#01ff39] self-center h-[60vh] rounded-md">
      {positions.length ? (
        positions.map((position, i) => (
          <UserPosition position={position} key={i} />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
