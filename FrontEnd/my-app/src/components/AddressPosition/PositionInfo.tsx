"use client";

import { useActiveAccount } from "thirdweb/react";
import { useParams } from "next/navigation";
import { GET_POSITIONS_BY_ID } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { Position } from "../Dashboard/OpenPositions";
import addTokenData from "@/lib/addTokenData";
import { useState, useEffect } from "react";
import formatNumber from "@/lib/formatNumber";

export default function PositionInfo() {
  const [position, setPosition] = useState<Position | null>(null);

  const activeAccount = useActiveAccount();

  const { address, positionId } = useParams();

  const { loading, error, data } = useQuery(GET_POSITIONS_BY_ID, {
    variables: { id: positionId },
    skip: !positionId,
  });

  const getTokenInfo = async () => {
    const updatedPositions: any = await addTokenData(data);
    setPosition(updatedPositions[0]);
  };

  useEffect(() => {
    if (data) {
      getTokenInfo();
    }
  }, [data]);

  return (
    <div className="flex flex-col">
      {address?.toString().toLowerCase() ==
        activeAccount?.address.toString().toLowerCase() && position ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-center space-x-1">
            <p className="text-white font-juraBold text-3xl">
              {position.tokenIn.symbol}/{position.tokenOut.symbol}
            </p>
          </div>
          <div className="text-white">
            Current Price: {position.price ? formatNumber(position.price) : 0}
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
