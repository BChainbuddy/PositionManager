"use client";

import { client } from "@/lib/client";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";

interface ConnectButtonProps {
  signer: any;
  setViewModal: (view: boolean) => void;
  viewModal: boolean;
  setViewModal2: (view: boolean) => void;
  viewModal2: boolean;
}

export default function ConnectButton({
  signer,
  setViewModal,
  viewModal,
  setViewModal2,
  viewModal2,
}: ConnectButtonProps) {
  const account = useActiveAccount();

  const { data, isLoading } = useWalletBalance({
    chain: sepolia,
    address: account?.address,
    client: client,
  });

  return (
    <>
      {account && data ? (
        <div
          className="text-white flex flex-col justify-evenly rounded-xl border-2 cursor-pointer connectButton w-[11rem] h-[3.5rem] items-center"
          onClick={() => {
            setViewModal2(!viewModal2);
          }}
        >
          {viewModal2 ? (
            <p className="text-center">X</p>
          ) : (
            <div className="w-fit gap-1 flex flex-col">
              <p className="text-xs">
                Address:{" "}
                {account?.address.substring(0, 8) +
                  "..." +
                  account?.address.substring(
                    account?.address.length - 3,
                    account?.address.length
                  )}
              </p>
              <p className="text-xs">
                Balance:{" "}
                {data.displayValue.toString().length > 9
                  ? data.displayValue.toString().substring(0, 8) +
                    " " +
                    data.symbol
                  : data.displayValue + " " + data.symbol}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          className="bg-[#01FF39] text-black font-juraBold h-[2rem] md:h-[2.2rem] w-[10rem] md:w-[12rem] rounded-xl text-center flex items-center justify-center cursor-pointer active:scale-[98%] active:translate-y-0.5 select-none"
          onClick={() => {
            setViewModal(!viewModal);
          }}
        >
          <p className="text-sm md:text-base">
            {viewModal ? "X" : "Connect Wallet"}
          </p>
        </div>
      )}
    </>
  );
}
