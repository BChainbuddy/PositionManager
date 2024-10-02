"use client";

import MarketCap from "@/components/MarketCap";
import OpenPositions from "@/components/OpenPositions";
import TopCoins from "@/components/TopCoins";
import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";

export default function Dashboard() {
  const account = useActiveAccount();
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <p className="text-white">
          Welcome back user{" "}
          <span className="text-[#01ff39]">
            {account?.address?.substring(0, 12) +
              "..." +
              account?.address?.substring(
                account?.address?.length - 3,
                account?.address?.length
              )}
          </span>
          !
        </p>
        <OpenPositions />
      </div>
      <div className="flex flex-col">
        <MarketCap />
        <TopCoins />
        <Link href="">
          <div className="bg-[#01ff39] text-black font-juraBold w-[14rem] h-[3rem] text-xl flex justify-center items-center rounded-xl">
            START TRADING
          </div>
        </Link>
      </div>
    </div>
  );
}
