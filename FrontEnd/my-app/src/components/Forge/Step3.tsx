"use client";

import { useState } from "react";
import PairPrice from "./PairPrice";
import { ethers } from "ethers";
import { useForge } from "@/context/ForgeContext";

interface Step3Props {
  nextStep: () => void;
  previousStep: () => void;
  step: number;
}

export default function Step3({ nextStep, previousStep, step }: Step3Props) {
  const [days, setDays] = useState<number>(0);
  const [executionPrice, setExecutionPrice] = useState<number>(0);

  const { dex } = useForge();

  return (
    <>
      {dex && (
        <div
          className={`h-full w-full flex flex-col text-white justify-center items-center font-juraBold transition-all duration-1000 absolute mx-auto ${
            step > 2
              ? "duration-500 opacity-0 z-10"
              : step === 2
              ? "opacity-100 z-20 delay-500"
              : "opacity-0 translate-x-10 z-10"
          }`}
        >
          <p className="text-center text-[#01FF39] text-xl">
            CHOOSE TRADE PARAMETERS
          </p>
          <PairPrice />
          <div className="flex flex-row space-x-2 mt-4">
            <p className="">Execution price:</p>
            <input
              placeholder="0.003"
              className="w-16 bg-[#D9D9D9] outline-none rounded-sm px-1 text-black"
              type="number"
              onChange={(e) => setExecutionPrice(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-row mt-4">
            <p>Duration:</p>
            <input
              placeholder="1"
              className="w-12 ml-2 bg-[#D9D9D9] outline-none rounded-sm px-1 text-black"
              type="number"
              onChange={(e) => setDays(Number(e.target.value))}
            />
            <p className="ml-0.5">Days</p>
          </div>
          <div className="flex flex-col mt-4 text-center relative group">
            <p className="text-center">Expected Fee</p>
            <div className="absolute top-6 z-20 bg-[#01FF39] h-[0.1rem] w-0 left-[50%] translate-x-[-50%] transition-all duration-500 group-hover:w-20"></div>
            <p>{days * Number(ethers.formatEther(1000000000000000))}</p>
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
      )}
    </>
  );
}
