"use client";

import { useEffect } from "react";
import { useForge } from "../../context/ForgeContext";
import { price } from "@/lib/price";

interface Step3Props {
  nextStep: () => void;
  previousStep: () => void;
}

export default function Step3({ nextStep, previousStep }: Step3Props) {
  const { inputToken, outputToken, dex } = useForge();

  const getPrice = async () => {
    if (dex) {
      await price(
        inputToken.address,
        outputToken.address,
        dex.address,
        dex.type,
        dex.fee ? dex.fee : "0",
        inputToken.decimals,
        outputToken.decimals
      );
    }
  };

  useEffect(() => {
    console.log("Dex", dex);
  }, []);

  return (
    <div className="h-full w-full flex flex-col text-white justify-center items-center font-juraBold">
      <p className="text-center text-[#01FF39] text-xl">
        CHOOSE TRADE PARAMETERS
      </p>
      <p className="mt-8">Current Price: 0</p>
      <div className="flex flex-row space-x-2 mt-4">
        <p>Execution price:</p>
        <input
          placeholder="0.003"
          className="w-16 bg-[#D9D9D9] outline-none rounded-sm px-1 text-black"
          type="number"
        />
      </div>
      <div className="flex flex-row mt-4">
        <p>Duration:</p>
        <input
          placeholder="1"
          className="w-12 ml-2 bg-[#D9D9D9] outline-none rounded-sm px-1 text-black"
          type="number"
        />
        <p className="ml-0.5">Days</p>
      </div>
      <button className="flex items-center justify-center h-8 w-24 bg-[#01FF39] rounded-2xl text-black mt-6">
        FORGE
      </button>
      <button
        className="text-sm flex items-center justify-center h-6 w-12 bg-white text-black rounded-2xl mt-2"
        onClick={previousStep}
      >
        back
      </button>
    </div>
  );
}
