"use client";

interface ConnectButtonProps {
  signer: any;
  setViewModal: (view: boolean) => void;
  viewModal: boolean;
}

export default function ConnectButton({
  signer,
  setViewModal,
  viewModal,
}: ConnectButtonProps) {
  return (
    <>
      {signer ? (
        <div>
          <p>{signer}</p>
        </div>
      ) : viewModal ? (
        <div
          className="bg-[#01FF39] text-black font-juraBold h-[2.2rem] w-[12rem] text-base rounded-xl text-center flex items-center justify-center hover:cursor-pointer"
          onClick={() => {
            setViewModal(!viewModal);
          }}
        >
          Close modal
        </div>
      ) : (
        <div
          className="bg-[#01FF39] text-black font-juraBold h-[2.2rem] w-[12rem] text-base rounded-xl text-center flex items-center justify-center hover:cursor-pointer"
          onClick={() => {
            setViewModal(!viewModal);
          }}
        >
          Connect Wallet
        </div>
      )}
    </>
  );
}
