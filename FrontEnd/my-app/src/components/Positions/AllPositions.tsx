"use client";

import { useEffect, useState } from "react";
import UserPosition from "./UserPosition";
import { Position } from "../Dashboard/OpenPositions";
import { useActiveAccount } from "thirdweb/react";
import { GET_POSITIONS_BY_WALLET } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import addTokenData from "@/lib/addTokenData";

export default function AllPosition() {
  const [positions, setPositions] = useState<Position[]>([]);

  const activeAccount = useActiveAccount();

  const { loading, error, data } = useQuery(GET_POSITIONS_BY_WALLET, {
    variables: { walletAddress: activeAccount?.address },
    skip: !activeAccount?.address,
  });

  const getTokenInfo = async () => {
    const updatedPositions: any = await addTokenData(data);
    setPositions(updatedPositions);
  };

  useEffect(() => {
    if (data) {
      getTokenInfo();
    }
  }, [data]);

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
