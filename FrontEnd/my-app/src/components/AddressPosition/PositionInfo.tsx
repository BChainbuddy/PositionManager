"use client";

import { useActiveAccount } from "thirdweb/react";
import { useParams } from "next/navigation";
import { GET_POSITIONS_BY_ID } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { Position } from "../Dashboard/OpenPositions";
import addTokenData from "@/lib/addTokenData";
import { useState, useEffect } from "react";
import formatNumber from "@/lib/formatNumber";
import getDate from "@/lib/getDate";
import CircleLoading from "@/ui/CircleLoading";
import ProlongTrade from "./ProlongTrade";

export default function PositionInfo() {
  const [position, setPosition] = useState<Position | null>(null);

  const activeAccount = useActiveAccount();

  const { address, positionId } = useParams();

  const { loading, error, data } = useQuery(GET_POSITIONS_BY_ID, {
    variables: { id: positionId },
    skip: !positionId,
  });

  function getTimeLeft(timestamp: number) {
    const timeLeft = timestamp * 1000 - Date.now();
    if (timeLeft < 0) {
      return "Trade has ended";
    }
    return `${Math.floor(timeLeft / 86400000)} days ${Math.floor(
      (timeLeft % 86400000) / 3600000
    )} hours left`;
  }

  const handleRemoveTrade = () => {};

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
    <div className="w-fit font-juraBold text-white h-[22rem]">
      {address?.toString().toLowerCase() ==
      activeAccount?.address.toString().toLowerCase() ? (
        <>
          {!data?.positions.length && !loading ? (
            <div className="flex h-full justify-center items-center">
              This position doesnt exist!
            </div>
          ) : position ? (
            <div className="flex flex-col font-juraBold h-full justify-between items-center">
              <div className="flex flex-row items-center justify-center space-x-1">
                <p className="font-juraBold text-3xl">
                  {position.tokenIn.symbol}/{position.tokenOut.symbol}
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  Current Price:{" "}
                  {position.price ? formatNumber(position.price) : 0}
                </p>
                <p>
                  Execution Price:{" "}
                  {formatNumber(position.executionValue / 10 ** 18)}
                </p>
                <p>End Date: {getDate(position.endTimestamp)}</p>
              </div>
              <p>{getTimeLeft(position.endTimestamp)}</p>
              <div className="flex flex-col items-center justify-center space-y-2">
                <p className="text-sm">Want to prolong the trade duration?</p>
                <ProlongTrade positionId={position.id} />
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <p className="text-sm">Stop the trade, receive the tokens</p>
                <button
                  className="py-2 px-3 w-fit bg-[#01FF39] rounded-lg text-black"
                  onClick={handleRemoveTrade}
                >
                  REMOVE TRADE
                </button>
              </div>
            </div>
          ) : (
            <CircleLoading
              height="h-7"
              width="w-7"
              innerColor="fill-[#01FF39]"
              label="Loading information"
            />
          )}
        </>
      ) : (
        <div className="flex h-full justify-center items-center">
          <p className="text-white">
            Address not able to see info to this position
          </p>
        </div>
      )}
    </div>
  );
}
