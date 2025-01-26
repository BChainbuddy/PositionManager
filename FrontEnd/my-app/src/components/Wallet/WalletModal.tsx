import { useActiveWallet, useDisconnect } from "thirdweb/react";

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
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  return (
    showModal &&
    wallet && (
      <div
        className={`fixed z-30 left-1/2 top-1/2 text-center rounded-2xl py-10 w-[20rem] px-8 flex flex-col ${
          showModal ? "block connectModal" : "hidden"
        }`}
      >
        <h1 className="text-3xl font-juraBold">WALLET</h1>
        <p
          className=" w-[8rem] h-[2rem] border-2 border-white flex justify-center items-center rounded-xl mx-auto cursor-pointer mt-5"
          onClick={() => {
            disconnect(wallet);
            setViewModal(false);
          }}
        >
          Disconnect
        </p>
      </div>
    )
  );
}
