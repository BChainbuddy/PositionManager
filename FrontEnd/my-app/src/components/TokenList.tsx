"use client";

import { useEffect, useState } from "react";
import tokenList from "@/data/coinlist.json";
import LogoWrapper from "./LogoWrapper";
import Image from "next/image";

interface TokenListProps {
  showModal: (arg1: boolean) => void;
  willChooseToken: (token: string) => void;
}

export default function TokenList({
  willChooseToken,
  showModal,
}: TokenListProps) {
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);

  const closeModal = () => {
    showModal(false);
  };

  const handleClose = (e: any) => {
    if (e.target.id === "wrapper") {
      closeModal();
    }
  };

  function filterTokenList(text: string) {
    const filterTokens =
      text !== ""
        ? filteredTokens.filter((token) =>
            token.symbol.toLowerCase().includes(text.toLowerCase())
          )
        : tokenList.tokens;
    setFilteredTokens(filterTokens);
  }

  useEffect(() => {
    setFilteredTokens(tokenList.tokens);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-opacity backdrop-blur-sm flex justify-center items-center z-20"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="w-[300px] flex flex-col">
        <button
          className="text-white text-xl place-self-end"
          onClick={closeModal}
        >
          X
        </button>
        <input
          className="bg-slate-300 rounded-t-md p-2 text-gray-600"
          type="text"
          placeholder="Search symbol..."
          onChange={(e) => filterTokenList(e.target.value)}
        ></input>
        <div
          id="tokenList"
          className="bg-amber-50 rounded text-center text-black flex flex-col overflow-y-auto h-80"
        >
          {filteredTokens.map((token, index) => (
            <div
              className="hover:bg-zinc-300 cursor-pointer transition-colors duration-100 ease-out flex justify-center items-center border border-gray-600 py-2 space-x-2"
              key={`${token.symbol}-${index}`}
              onClick={() => {
                willChooseToken(token);
                closeModal();
              }}
            >
              <p>{token.symbol}</p>
              <div className="relative h-6 w-6">
                <Image
                  src={token.logoURI ? token.logoURI : "/uknownToken.jpg"}
                  alt={`${token.symbol} symbol`}
                  fill
                  className="bg-white rounded-full overflow-clip"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
