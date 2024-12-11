"use client";

import { useActiveAccount } from "thirdweb/react";
import { useParams } from "next/navigation";
import { mockPosition } from "@/data/mockPosition";
import TokenSymbol from "./TokenSymbol";
//
export default function PositionInfo() {
  const activeAccount = useActiveAccount();

  const { address, positionId } = useParams();

  return (
    <div className="flex flex-col">
      {address == activeAccount?.address ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-center space-x-1">
            <TokenSymbol
              tokenAddress={mockPosition.tokenIn}
              className="text-white font-juraBold text-3xl"
            />
            <p className="text-white font-juraBold text-3xl">/</p>
            <TokenSymbol
              tokenAddress={mockPosition.tokenOut}
              className="text-white font-juraBold text-3xl"
            />
          </div>
          <div>
            Current Price:{" "}
            {price(
              mockPosition.tokenIn,
              mockPosition.tokenOut,
              mockPosition.dexRouter,
              mockPosition.forkABI,
              mockPosition.fee,
              foundTokenIn ? foundTokenIn.decimals : 0,
              foundTokenOut ? foundTokenOut.decimals : 0
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-white">
            Address not able to see info to this position
          </p>
        </div>
      )}
    </div>
  );
}
