"use client";

import { useState } from "react";
import ConnectButton from "./ConnectButton";
import ConnectModal from "../Wallet/ConnectModal";
import WalletModal from "../Wallet/WalletModal";

export default function Header() {
  const [signer, setSigner] = useState<any>(undefined);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [viewModal2, setViewModal2] = useState<boolean>(false);

  return (
    <>
      <div className="w-full h-[11vh] header flex flex-row items-center justify-between px-16 z-50 relative">
        <p className="text-[#01FF39] text-4xl font-juraBold">
          TRADE <span className="text-white ml-1">FORGE</span>
        </p>
        {/* <ConnectWallet className="!bg-[#01FF39] !text-black !font-juraBold !h-[2.2rem] !w-[12rem] !text-base !rounded-xl" /> */}
        <ConnectButton
          setViewModal={setViewModal}
          viewModal={viewModal}
          signer={signer}
          setViewModal2={setViewModal2}
          viewModal2={viewModal2}
        />
      </div>
      {viewModal && (
        <ConnectModal
          showModal={viewModal}
          setSigner={setSigner}
          setViewModal={setViewModal}
        />
      )}
      {viewModal2 && (
        <WalletModal
          showModal={viewModal2}
          setSigner={setSigner}
          setViewModal={setViewModal2}
        />
      )}
    </>
  );
}
