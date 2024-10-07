import { useEffect, useState } from "react";
import CoinList from "@/data/coinlist.json";
import OpenPosition from "./OpenPosition";

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
}

export default function OpenPositions() {
  const [positions, setPositions] = useState<any[]>([]);

  // Mock call to conract, since it is on testnet and
  // doesnt have addresses that are recognised coingecko
  const mockPositions: Position[] = [
    {
      // CHAINLINK/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenIn: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
      tokenOut: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
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
      tokenIn: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
      tokenOut: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
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
      tokenIn: "0x61299774020da444af134c82fa83e3810b309991",
      tokenOut: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
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
      tokenIn: "0x5fe2b58c013d7601147dcdd68c143a77499f5531",
      tokenOut: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
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
      tokenIn: "0x6f7c932e7684666c9fd1d44527765433e01ff61d",
      tokenOut: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
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
      tokenIn: "0xe5b49820e5a1063f6f4ddf851327b5e8b2301048",
      tokenOut: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
    {
      // MANTRA/POL
      wallet: "0xd2fdd21AC3553Ac578a69a64F833788f2581BF05",
      dexRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      tokenIn: "0xc3ec80343d2bae2f8e680fdadde7c17e71e114ea",
      tokenOut: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      quantity: 100000000000000000000,
      executionValue: 20000000000000000000,
      endTimestamp: 1730313600,
      fee: "3000",
      executed: false,
      forkABI: 1,
    },
  ];

  const addTokenData = () => {
    mockPositions.forEach((position: any, i: number) => {
      const foundTokenIn: any = CoinList.tokens.find(
        (element: any) => element.address === position.tokenIn
      );
      const foundTokenOut: any = CoinList.tokens.find(
        (element: any) => element.address === position.tokenOut
      );
      mockPositions[i].symbolIn = foundTokenIn ? foundTokenIn.symbol : "";
      mockPositions[i].symbolOut = foundTokenOut ? foundTokenOut.symbol : "";
      mockPositions[i].nameIn = foundTokenIn ? foundTokenIn.name : "";
      mockPositions[i].nameOut = foundTokenOut ? foundTokenOut.name : "";
      mockPositions[i].decimalsIn = foundTokenIn ? foundTokenIn.decimals : "";
      mockPositions[i].decimalsOut = foundTokenOut
        ? foundTokenOut.decimals
        : "";
      mockPositions[i].imgIn = foundTokenIn ? foundTokenIn.logoURI : "";
      mockPositions[i].imgOut = foundTokenOut ? foundTokenOut.logoURI : "";
    });
    setPositions(mockPositions);
  };

  useEffect(() => {
    addTokenData();
  }, []);

  return (
    <>
      <p>Your open positions</p>
      <div>
        <div className="positionsGrid bg-[#D9D9D913] rounded-lg">
          {positions.length ? (
            positions.map((position) => <OpenPosition position={position} />)
          ) : (
            <></>
          )}
        </div>
        <button>VIEW MORE</button>
      </div>
    </>
  );
}
