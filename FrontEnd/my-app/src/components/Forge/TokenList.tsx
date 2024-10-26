"use client";

import { useEffect, useState } from "react";
import tokenList from "@/data/coinlist.json";
import Image from "next/image";
import { useForge } from "../../context/ForgeContext";
import { ethers } from "ethers";
import { client } from "@/lib/client";
import { polygon } from "thirdweb/chains";
import ERC20Abi from "@/data/ERC20Abi.json";
import { getContract, readContract } from "thirdweb";
import { Abi } from "thirdweb/utils";

interface TokenListProps {
  showModal: (arg1: boolean) => void;
  input: boolean;
}

export default function TokenList({ input, showModal }: TokenListProps) {
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);

  const { setInputToken, setOutputToken } = useForge();

  const closeModal = () => {
    showModal(false);
  };

  const handleClose = (e: any) => {
    if (e.target.id === "wrapper") {
      closeModal();
    }
  };

  async function filterTokenList(text: string | undefined) {
    if (ethers.isAddress(text)) {
      findToken(text);
    } else {
      const filterTokens =
        text !== ""
          ? tokenList.tokens.filter((token) =>
              token.symbol.toLowerCase().includes((text || "").toLowerCase())
            )
          : tokenList.tokens;
      setFilteredTokens(filterTokens);
    }
  }

  async function findToken(address: string) {
    try {
      const contract = getContract({
        client,
        address: address,
        chain: polygon,
        abi: ERC20Abi as Abi, // Cast ABI as object[],
      });

      // Read the symbol, name and decimals from the token contract
      console.log(contract);

      const Name = await readContract({
        contract: contract,
        method: "function name() view returns (string)",
        params: [],
      });

      const Symbol = await readContract({
        contract: contract,
        method: "function symbol() view returns (string)",
        params: [],
      });

      const Decimals = await readContract({
        contract: contract,
        method: "function decimals() view returns (uint256)",
        params: [],
      });
      setFilteredTokens([{ symbol: Symbol, name: Name, decimals: Decimals }]);
    } catch (err) {
      console.log(err);
    }
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
          className="bg-slate-300 rounded-t-md p-2 text-gray-600 outline-none"
          type="text"
          placeholder="Search symbol..."
          onChange={(e) => filterTokenList(e.target.value)}
        ></input>
        <div
          id="tokenList"
          className="bg-amber-50 rounded-b-md text-center text-black flex flex-col overflow-y-auto h-80"
        >
          {filteredTokens.length ? (
            filteredTokens.map((token, index) => (
              <div
                className="hover:bg-zinc-300 cursor-pointer transition-colors duration-100 ease-out flex justify-center items-center border border-gray-600 py-2 space-x-2"
                key={`${token.symbol}-${index}`}
                onClick={() => {
                  input ? setInputToken(token) : setOutputToken(token);
                  closeModal();
                }}
              >
                <p>{token.symbol}</p>
                <div className="relative h-6 w-6">
                  <Image
                    src={token.logoURI ? token.logoURI : "/unknownToken.png"}
                    alt={`${token.symbol} symbol`}
                    fill
                    className="bg-white rounded-full overflow-clip"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-[#3f3f3f] text-xs px-1.5 mt-1">
              Cannot find the symbol? Input the token address and we'll find it
              for you!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
