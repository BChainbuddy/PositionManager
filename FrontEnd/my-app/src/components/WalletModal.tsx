import { useDisconnect } from "@thirdweb-dev/react";
import { useState } from "react";
import { useActiveWallet } from "thirdweb/react";

interface WalletModalProps {
  showModal: boolean;
  setSigner: (s: any) => any;
  setViewModal: (show: boolean) => any;
}

export default function WalletModal({
  showModal,
  setSigner,
  setViewModal,
}: WalletModalProps) {
  const connectedWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  return (
    <div
      className={`fixed z-20 left-1/2 top-1/2 text-center rounded-2xl py-10 w-[20rem] px-8 ${
        showModal ? "block connectModal" : "hidden"
      }`}
    >
      <h1 className="text-3xl font-juraBold">WALLET</h1>
      <p className="" onClick={() => disconnect(connectedWallet)}>
        Disconnect
      </p>
    </div>
  );
}
