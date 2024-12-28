import { useEffect, useState } from "react";
import OpenPosition from "./OpenPosition";
import { price } from "@/lib/price";
import { useQuery } from "@apollo/client";
import { GET_POSITIONS_BY_WALLET } from "@/lib/queries";
import { useActiveAccount } from "thirdweb/react";
import TOKEN_IMAGES from "@/data/tokenImages.json";
import Link from "next/link";

const TOKEN_IMAGES_TYPED: Record<string, string> = TOKEN_IMAGES as Record<
  string,
  string
>;

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
  };
  tokenOut: {
    symbol: string;
    address: string;
    decimals: number;
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
    <div className="flex flex-col mt-10">
      <p className="text-white mb-3 ml-2 font-interBold text-sm">
        Your open positions
      </p>
      {activeAccount?.address ? (
        <div className="positionsGrid grid grid-cols-3 w-[25rem] gap-[1.5rem] place-items-center h-[21rem]">
          {positions.length ? (
            positions.map((position: any, i: number) => (
              <OpenPosition position={position} key={i} />
            ))
          ) : (
            <></>
          )}
          <Link
            className="col-span-3 w-[7rem] h-[1.5rem] bg-[#01FF39] rounded-xl text-xs flex justify-center items-center"
            href="/dashboard/positions"
          >
            VIEW MORE
          </Link>
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
