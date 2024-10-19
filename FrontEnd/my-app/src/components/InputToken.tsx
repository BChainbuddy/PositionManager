"use client";

import { useEffect, useState } from "react";
import TokenList from "./TokenList";
import { shortenSymbol } from "@/lib/shortenSymbol";
import { useForge } from "./ForgeContext";

export default function InputToken({ input }: { input: boolean }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { inputToken, outputToken } = useForge();

  return (
    <>
      <div className="bg-[#282727] h-7 rounded-xl hover:bg-[#1b5e3591] transition-all duration-500 cursor-pointer w-24 text-center ease-out flex items-center justify-center">
        <p onClick={() => setShowModal(!showModal)}>
          {input
            ? inputToken.symbol
              ? shortenSymbol(7, inputToken.symbol)
              : "SYMBOL"
            : outputToken.symbol
            ? shortenSymbol(7, outputToken.symbol)
            : "SYMBOL"}
        </p>
      </div>
      {showModal && <TokenList showModal={setShowModal} input={input} />}
    </>
  );
}
