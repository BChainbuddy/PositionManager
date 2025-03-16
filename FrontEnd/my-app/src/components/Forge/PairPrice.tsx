"use client";

import { useEffect } from "react";
import { useForge } from "../../context/ForgeContext";
import { price } from "@/lib/price";
import formatNumber from "@/lib/formatNumber";

export default function PairPrice({ step }: any) {
  const { inputToken, outputToken, dex, setSwapPrice, swapPrice } = useForge();

  const getPrice = async () => {
    if (dex && step === 2) {
      const returnedPrice = await price(
        inputToken.address,
        outputToken.address,
        dex.address,
        dex.type === "V3" ? 0 : 1,
        dex.fee ? dex.fee : "0",
        inputToken.decimals,
        outputToken.decimals
      );
      console.log(returnedPrice);
      if (returnedPrice) {
        setSwapPrice(returnedPrice);
      }
    }
  };

  useEffect(() => {
    getPrice();
  }, [step]);

  return (
    <div className="flex flex-col mt-5 text-center relative group">
      <p className="">Current Price</p>
      <div className="absolute top-6 z-20 bg-[#01FF39] h-[0.1rem] w-0 left-[50%] translate-x-[-50%] transition-all duration-500 group-hover:w-20"></div>
      <p className="">
        1 {inputToken.symbol} ={" "}
        {formatNumber(swapPrice) + " " + outputToken.symbol}
      </p>
    </div>
  );
}
