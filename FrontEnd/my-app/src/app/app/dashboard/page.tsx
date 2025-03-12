"use client";

import MarketCap from "@/components/Dashboard/MarketCap";
import OpenPositions from "@/components/Dashboard/OpenPositions";
import TopCoins from "@/components/Dashboard/TopCoins";
import Button from "@/ui/Button";
import { useActiveAccount } from "thirdweb/react";

export default function Dashboard() {
  const account = useActiveAccount();

  return (
    <div className="flex flex-row justify-evenly h-[89vh] items-center">
      <div className="flex flex-col h-full justify-evenly">
        {account?.address ? (
          <p className="text-white font-interBold">
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
          <p className="text-white font-interBold">
            Connect your wallet to forge your next trade!
          </p>
        )}
        <OpenPositions />
      </div>
      <div className="flex flex-col h-full justify-evenly">
        <MarketCap />
        <TopCoins />
        <Button
          className="w-[14rem] h-[3rem] text-xl self-center rounded-xl"
          title="FORGE TRADE"
          href="/app/forge"
        />
      </div>
    </div>
  );
}
