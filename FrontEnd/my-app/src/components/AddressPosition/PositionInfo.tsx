"use client";

import { useActiveAccount } from "thirdweb/react";
import { useParams } from "next/navigation";
//
export default function PositionInfo() {
  const activeAccount = useActiveAccount();

  const { address, positionId } = useParams();

  return (
    <div className="flex flex-col">
      {address == activeAccount?.address ? (
        <>
          <div>Position Number: {"1"}</div>
          <div></div>
        </>
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
