"use client";

import { useActiveAccount } from "thirdweb/react";
import { useParams } from "next/navigation";

export default function Graph() {
  const { address, positionId } = useParams();

  const activeAccount = useActiveAccount();

  return (
    <>
      {address == activeAccount?.address ? (
        <div className="h-[30rem] w-[30rem] bg-white border-gray-500 border-2 rounded-sm">
          Graph
        </div>
      ) : (
        <div className="h-[30rem] w-[30rem] bg-white border-gray-500 border-2 flex items-center justify-center rounded-sm">
          Graph Unavailable
        </div>
      )}
    </>
  );
}
