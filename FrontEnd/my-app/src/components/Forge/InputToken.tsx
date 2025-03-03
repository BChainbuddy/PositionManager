"use client";

import { useState } from "react";
import TokenList from "./TokenList";
import { shortenSymbol } from "@/lib/shortenSymbol";
import { useForge } from "../../context/ForgeContext";
import Image from "next/image";

export default function InputToken({ input }: { input: boolean }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { inputToken, outputToken } = useForge();

  return (
    <>
      <div className="bg-[#282727] h-8 rounded-xl hover:bg-[#1b5e3591] transition-all duration-500 cursor-pointer w-28 text-center ease-out flex items-center justify-center space-x-1">
        <p onClick={() => setShowModal(!showModal)}>
          {input
            ? inputToken.symbol
              ? shortenSymbol(7, inputToken.symbol)
              : "SYMBOL"
            : outputToken.symbol
            ? shortenSymbol(7, outputToken.symbol)
            : "SYMBOL"}
        </p>
        {input
          ? inputToken.symbol && (
              <div className="relative h-5 w-5">
                <Image
                  src={inputToken.image ?? "/unknownToken.png"}
                  alt={`${inputToken.symbol} symbol`}
                  fill
                  className="bg-white rounded-full overflow-clip"
                />
              </div>
            )
          : outputToken.symbol && (
              <div className="relative h-5 w-5">
                <Image
                  src={outputToken.image ?? "/unknownToken.png"}
                  alt={`${outputToken.symbol} symbol`}
                  fill
                  className="bg-white rounded-full overflow-clip"
                />
              </div>
            )}
      </div>
      {showModal && <TokenList showModal={setShowModal} input={input} />}
    </>
  );
}
