"use client";

import { useEffect, useState } from "react";
import AvailableDexes from "./AvailableDexes";
import { useForge } from "../../context/ForgeContext";

interface Step2Props {
  nextStep: () => void;
  previousStep: () => void;
}

export default function Step2({ nextStep, previousStep }: Step2Props) {
  const [automatic, setAutomatic] = useState(true);

  const { setRouterAddress } = useForge();

  useEffect(() => {
    if (automatic) {
      setRouterAddress("");
    }
  }, [automatic]);

  return (
    <div className="h-full w-full flex flex-col text-white justify-center items-center font-juraBold">
      <p className="text-center text-[#01FF39] text-xl">CHOOSE LIQUIDITY</p>
      <div className="flex flex-row space-x-2 mt-6">
        <p>Automatic</p>
        <div
          className={` w-[3rem] h-[1.5rem] relative z-10 rounded-xl flex items-center transition-all duration-1000 ease-in-out ${
            automatic ? "bg-green-400" : "bg-green-900"
          }`}
        >
          <div
            className={`absolute z-20 rounded-full h-[1.3rem] w-[1.3rem] bg-white transition-all duration-1000 ease-in-out cursor-pointer ${
              automatic ? "translate-x-[1.6rem]" : "translate-x-[0.1rem]"
            }`}
            onClick={() => setAutomatic(!automatic)}
          ></div>
        </div>
      </div>
      <AvailableDexes automatic={automatic} />
      <button
        className="flex items-center justify-center h-8 w-24 bg-[#01FF39] rounded-2xl text-black mt-6"
        onClick={nextStep}
      >
        CONTINUE
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
