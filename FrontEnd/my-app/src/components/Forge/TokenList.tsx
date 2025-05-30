"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForge } from "../../context/ForgeContext";
import { ethers } from "ethers";
import { client } from "@/lib/client";
import { sepolia } from "thirdweb/chains";
import ERC20Abi from "@/data/ERC20Abi.json";
import { getContract, readContract } from "thirdweb";
import { Abi } from "thirdweb/utils";
import { GET_TOKENS } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { TOKEN_IMAGES } from "@/data/tokenImages";

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

  const { loading, error, data } = useQuery(GET_TOKENS);

  async function filterTokenList(text: string | undefined) {
    if (ethers.isAddress(text)) {
      findToken(text);
    } else {
      const filterTokens =
        text !== ""
          ? data.tokens.filter((token: any) =>
              token.symbol.toLowerCase().includes((text || "").toLowerCase())
            )
          : data.tokens;
      setFilteredTokens(filterTokens);
    }
  }

  async function findToken(address: string) {
    try {
      const contract = getContract({
        client,
        address: address,
        chain: sepolia,
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
    if (data) {
      console.log("tokens", data);
      setFilteredTokens(data.tokens);
    }
  }, [data]);

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
          x
        </button>
        <input
          className="rounded-t-md p-2 text-gray-600 outline-none"
          type="text"
          placeholder="Search symbol..."
          onChange={(e) => filterTokenList(e.target.value)}
        ></input>
        <div
          id="tokenList"
          className="bg-amber-50 rounded-b-md text-center text-black flex flex-col overflow-y-auto h-80"
        >
          {filteredTokens.length ? (
            filteredTokens.map((token: any, index: number) => (
              <div
                className="hover:bg-zinc-300 cursor-pointer transition-colors duration-100 ease-out flex justify-center items-center border border-gray-600 py-2 space-x-2"
                key={`${token.symbol}-${index}`}
                onClick={() => {
                  input
                    ? setInputToken({
                        ...token,
                        image:
                          TOKEN_IMAGES[token.address].image ??
                          "/unknownToken.png",
                        placeholder:
                          TOKEN_IMAGES[token.address].placeholder ??
                          "/unknownToken.png",
                      })
                    : setOutputToken({
                        ...token,
                        image:
                          TOKEN_IMAGES[token.address].image ??
                          "/unknownToken.png",
                        placeholder:
                          TOKEN_IMAGES[token.address].placeholder ??
                          "/unknownToken.png",
                      });
                  closeModal();
                }}
              >
                <p>{token.symbol}</p>
                <div className="relative h-6 w-6">
                  <Image
                    src={
                      TOKEN_IMAGES[token.address]
                        ? TOKEN_IMAGES[token.address].image
                        : "/unknownToken.png"
                    }
                    alt={`${token.symbol} symbol`}
                    fill
                    className="bg-white rounded-full overflow-clip"
                    onBlur={() => {
                      TOKEN_IMAGES[token.address]
                        ? TOKEN_IMAGES[token.address].placeholder
                        : "/unknownToken.png";
                    }}
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
