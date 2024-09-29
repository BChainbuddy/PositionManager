"use client";

import { useState } from "react";
import ConnectButton from "./ConnectButton";
import ConnectModal from "./ConnectModal";

export default function Header() {
  const [signer, setSigner] = useState<any>(undefined);
  const [viewModal, setViewModal] = useState<boolean>(false);

  return (
    <>
      <div className="w-full h-[11vh] header flex flex-row items-center justify-between px-16 drop-shadow-[0_0_0.5rem_#01ff39]">
        <p className="text-[#01FF39] text-4xl font-juraBold">
          TRADE <span className="text-white ml-1">FORGE</span>
        </p>
        {/* <ConnectWallet className="!bg-[#01FF39] !text-black !font-juraBold !h-[2.2rem] !w-[12rem] !text-base !rounded-xl" /> */}
        <ConnectButton
          setViewModal={setViewModal}
          viewModal={viewModal}
          signer={signer}
        />
      </div>
      {viewModal && (
        <ConnectModal showModal={viewModal} setSigner={setSigner} />
      )}
    </>
  );
}
