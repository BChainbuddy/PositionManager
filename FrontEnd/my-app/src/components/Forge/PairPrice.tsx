"use client";

import { useEffect, useState } from "react";
import { useForge } from "../../context/ForgeContext";
import { price } from "@/lib/price";

export default function PairPrice({ step }: any) {
  const [tokenPrice, setTokenPrice] = useState<number>(0);

  const { inputToken, outputToken, dex } = useForge();

  const getPrice = async () => {
    if (dex) {
      const returnedPrice = await price(
        inputToken.address,
        outputToken.address,
        dex.address,
        dex.type === "V3" ? 1 : 0,
        dex.fee ? dex.fee : "0",
        inputToken.decimals,
        outputToken.decimals
      );
      console.log("FEE TIER", dex.fee);
      console.log(returnedPrice);
      if (returnedPrice) {
        setTokenPrice(returnedPrice);
      }
    }
  };

  useEffect(() => {
    console.log("Dex", dex);
    console.log("FETCHING PRICE");
    getPrice();
  }, [step]);

  return (
    <div className="flex flex-col mt-5 text-center relative group">
      <p className="">Current Price</p>
      <div className="absolute top-6 z-20 bg-[#01FF39] h-[0.1rem] w-0 left-[50%] translate-x-[-50%] transition-all duration-500 group-hover:w-20"></div>
      <p className="">{tokenPrice}</p>
    </div>
  );
}
