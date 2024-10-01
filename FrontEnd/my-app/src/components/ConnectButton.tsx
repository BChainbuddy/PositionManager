"use client";

import { client } from "@/lib/client";
import { useBalance } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
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
  const [balance, setBalance] = useState<number>(0);

  const account = useActiveAccount();
  const { data, isLoading } = useWalletBalance({
    chain: "80002",
    address: account,
    client: client,
  });

  return (
    <>
      {signer && data ? (
        <div
          className="h-[4rem] w-[15rem] bg-[#071007] text-white flex flex-col justify-evenly px-6 rounded-xl border-2 border-gray-600"
          onClick={() => {
            setViewModal2(!viewModal2);
          }}
        >
          <p>
            Address:{" "}
            {signer.address.substring(0, 8) +
              "..." +
              signer.address.substring(
                signer.address.length - 3,
                signer.address.length
              )}
          </p>
          <p>
            Balance:{" "}
            {(data.displayValue ? data.displayValue : "0") + " " + data.symbol}
          </p>
        </div>
      ) : (
        <div
          className="bg-[#01FF39] text-black font-juraBold h-[2.2rem] w-[12rem] text-base rounded-xl text-center flex items-center justify-center cursor-pointer active:scale-[98%] active:translate-y-0.5 select-none"
          onClick={() => {
            setViewModal(!viewModal);
          }}
        >
          {viewModal ? "X" : "Connect Wallet"}
        </div>
      )}
    </>
  );
}
