"use client";

import PairPrice from "./PairPrice";
import { useForge } from "@/context/ForgeContext";
import TransactionButton from "./TransactionButton";
import { useEffect } from "react";
import CONTRACT_ADDRESSES from "@/data/contractAddresses.json";
import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/client";

interface Step3Props {
  nextStep: () => void;
  previousStep: () => void;
  step: number;
}

export default function Step3({ nextStep, previousStep, step }: Step3Props) {
  const { dex, setParameters, parameters } = useForge();

  useEffect(() => {
    const getDailyFee = async () => {
      const contract = getContract({
        client: client,
        address: CONTRACT_ADDRESSES["11155111"] as unknown as string,
        chain: sepolia,
      });
      const dailyFee = await readContract({
        contract: contract,
        method: "function getDailyPositionFee() view returns (uint256)",
      });
      setParameters((prev) => ({
        ...prev,
        fee: dailyFee * BigInt(parameters?.days ?? 0),
      }));
    };
    getDailyFee();
  }, [parameters?.days]);

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
          <p className="text-center text-[#01FF39] text-2xl">
            CHOOSE TRADE PARAMETERS
          </p>
          <PairPrice step={step} />
          <div className="flex flex-row space-x-2 mt-4">
            <p className="">Execution price:</p>
            <input
              placeholder="0.003"
              className="w-16 bg-[#D9D9D9] outline-none rounded-sm px-1 text-black"
              type="number"
              onChange={(e) => {
                const price = Number(e.target.value) * 10 ** 18;
                setParameters((prev) => ({
                  ...prev,
                  executionPrice: price,
                }));
              }}
            />
          </div>
          <div className="flex flex-row space-x-2 mt-4">
            <p className="">Quantity:</p>
            <input
              placeholder="1000"
              className="w-16 bg-[#D9D9D9] outline-none rounded-sm px-1 text-black"
              type="number"
              onChange={(e) => {
                const quantity = Number(e.target.value);
                setParameters((prev) => ({
                  ...prev,
                  quantity: quantity,
                }));
              }}
            />
          </div>
          <div className="flex flex-row mt-4">
            <p>Duration:</p>
            <input
              placeholder="1"
              className="w-12 ml-2 bg-[#D9D9D9] outline-none rounded-sm px-1 text-black"
              type="number"
              onChange={(e) => {
                const days = Number(e.target.value);
                setParameters((prev) => ({
                  ...prev,
                  days: days,
                }));
              }}
            />
            <p className="ml-0.5">Days</p>
          </div>
          <div className="flex flex-col mt-4 text-center relative group">
            <p className="text-center">Expected Fee</p>
            <div className="absolute top-6 z-20 bg-[#01FF39] h-[0.1rem] w-0 left-[50%] translate-x-[-50%] transition-all duration-500 group-hover:w-20"></div>
            <p>{Number(parameters?.fee) / 10 ** 18} eth</p>
          </div>
          <TransactionButton nextStep={nextStep} />
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
