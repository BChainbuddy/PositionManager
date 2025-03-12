import { useEffect, useState } from "react";
import OpenPosition from "./OpenPosition";
import { useQuery } from "@apollo/client";
import { GET_POSITIONS_BY_WALLET } from "@/lib/queries";
import { useActiveAccount } from "thirdweb/react";
import Link from "next/link";
import addTokenData from "@/lib/addTokenData";
import CircleLoading from "@/ui/CircleLoading";

export interface Position {
  id: number;
  wallet: string;
  dexRouter: {
    id: string;
  };
  tokenIn: {
    symbol: string;
    address: string;
    decimals: number;
    img: string;
    blurImg: string;
  };
  tokenOut: {
    symbol: string;
    address: string;
    decimals: number;
    img: string;
    blurImg: string;
  };
  quantity: number;
  executionValue: number;
  endTimestamp: number;
  fee: string;
  executed: boolean;
  forkABI: number;
  imgIn?: string;
  imgOut?: string;
  price?: number;
}

export default function OpenPositions() {
  const [positions, setPositions] = useState<any[] | null>(null);

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
    <div className="flex flex-col">
      <p className="text-white mb-3 ml-2 text-sm font-juraBold">
        YOUR OPEN POSITIONS
      </p>
      {activeAccount?.address ? (
        <div className="positionsGrid grid grid-cols-3 w-[25rem] gap-[1.5rem] place-items-center h-[21rem]">
          {!positions ? (
            <div className="flex justify-center items-center h-full col-span-3">
              <CircleLoading
                height="h-10"
                width="w-10"
                innerColor="fill-[#01FF39]"
              />
            </div>
          ) : positions.length ? (
            <>
              {positions.slice(0, 6).map((position: any, i: number) => (
                <OpenPosition position={position} key={i} />
              ))}
              <Link
                className="col-span-3 w-[7rem] h-[1.5rem] bg-[#01FF39] rounded-xl text-xs flex justify-center items-center"
                href="/app/positions"
              >
                VIEW MORE
              </Link>
            </>
          ) : (
            <div className="flex justify-center items-center h-full col-span-3">
              <p className="text-white">No positions yet!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="positionsGrid w-[25rem] h-[21rem] flex items-center justify-center">
          <p className="font-juraBold text-[#01FF39] text-sm">
            Connect account to see positions
          </p>
        </div>
      )}
    </div>
  );
}
