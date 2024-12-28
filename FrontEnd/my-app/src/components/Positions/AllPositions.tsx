"use client";

import { useEffect, useState } from "react";
import { price } from "@/lib/price";
import UserPosition from "./UserPosition";
import { Position } from "../Dashboard/OpenPositions";
import TOKEN_IMAGES from "@/data/tokenImages.json";
import { useActiveAccount } from "thirdweb/react";
import { GET_POSITIONS_BY_WALLET } from "@/lib/queries";
import { useQuery } from "@apollo/client";

const TOKEN_IMAGES_TYPED: Record<string, string> = TOKEN_IMAGES as Record<
  string,
  string
>;

export default function AllPosition() {
  const [positions, setPositions] = useState<any[]>([]);

  const activeAccount = useActiveAccount();

  const { loading, error, data } = useQuery(GET_POSITIONS_BY_WALLET, {
    variables: { walletAddress: activeAccount?.address },
    skip: !activeAccount?.address,
  });

  const addTokenData = async () => {
    const updatedPositions = await Promise.all(
      data.positions.map(async (position: Position) => {
        return {
          ...position,
          imgIn: TOKEN_IMAGES_TYPED[position.tokenIn.address]
            ? TOKEN_IMAGES_TYPED[position.tokenIn.address]
            : "",
          imgOut: TOKEN_IMAGES_TYPED[position.tokenOut.address]
            ? TOKEN_IMAGES_TYPED[position.tokenOut.address]
            : "",
          price: await price(
            position.tokenIn.address,
            position.tokenOut.address,
            position.dexRouter.id,
            position.forkABI,
            position.fee,
            position.tokenIn.decimals,
            position.tokenOut.decimals
          ),
        };
      })
    );
    setPositions(updatedPositions);
  };

  useEffect(() => {
    if (data) {
      addTokenData();
    }
  }, [data]);

  return (
    <div className="allPositionsGrid w-full mt-4 border-4 border-[#01ff39] self-center h-[60vh] rounded-md">
      {positions.length ? (
        positions.map((position, i) => (
          <UserPosition
            position={position}
            key={i}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
