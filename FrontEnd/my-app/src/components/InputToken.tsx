"use client";

import { useEffect, useState } from "react";
import TokenList from "./TokenList";
import { shortenSymbol } from "@/lib/shortenSymbol";

export default function InputToken() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chosenToken, setChosenToken] = useState<any>("");

  useEffect(() => {
    console.log(chosenToken);
  }, [chosenToken]);
  return (
    <>
      <div className="bg-[#282727] h-7 rounded-xl hover:bg-[#1b5e3591] transition-all duration-500 cursor-pointer w-24 text-center ease-out flex items-center justify-center">
        <p onClick={() => setShowModal(!showModal)}>
          {chosenToken.symbol ? shortenSymbol(7, chosenToken.symbol) : "SYMBOL"}
        </p>
      </div>
      {showModal && (
        <TokenList showModal={setShowModal} willChooseToken={setChosenToken} />
      )}
    </>
  );
}
