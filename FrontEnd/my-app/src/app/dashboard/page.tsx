"use client";

import MarketCap from "@/components/MarketCap";
import OpenPositions from "@/components/OpenPositions";
import { usePageTransition } from "@/components/PageTransitionContext";
import TopCoins from "@/components/TopCoins";
import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";

export default function Dashboard() {
  const account = useActiveAccount();

  const { triggerTransition } = usePageTransition();

  return (
    <div className="flex flex-row justify-evenly h-[89vh]">
      <div className="flex flex-col h-full">
        {account?.address ? (
          <p className="text-white mt-14 font-interBold">
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
        ) : (
          <p className="text-white mt-14 font-interBold">
            Connect your wallet to forge your next trade!
          </p>
        )}
        <OpenPositions />
      </div>
      <div className="flex flex-col h-full pt-12">
        <MarketCap />
        <TopCoins />
        <Link
          href="/dashboard/positions"
          className="mt-16 self-center"
          onClick={triggerTransition}
        >
          <div className="bg-[#01ff39] text-black font-juraBold w-[14rem] h-[3rem] text-xl flex justify-center items-center rounded-xl">
            START TRADING
          </div>
        </Link>
      </div>
    </div>
  );
}
