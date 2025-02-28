import { useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";

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
  const [transfer, setTransfer] = useState<boolean>(false);

  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const { disconnect } = useDisconnect();

  useEffect(() => {
    async function getBalances() {
      const response = await fetch(`/api/walletBalances/${account?.address}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();
      console.log(data);
    }
    if (account?.address) {
      getBalances();
    }
  }, [account]);

  return (
    showModal &&
    wallet && (
      <div
        className={`fixed z-30 left-1/2 top-1/2 text-center rounded-2xl py-10 w-[20rem] px-8 flex flex-col ${
          showModal ? "block connectModal" : "hidden"
        }`}
      >
        <h1 className="text-3xl font-juraBold">WALLET</h1>
        {transfer ? (
          <div></div>
        ) : (
          <ActionButton text="Transfer" onClick={() => setTransfer(true)} />
        )}
        <ActionButton
          text="Disconnect"
          onClick={() => {
            disconnect(wallet);
            setViewModal(false);
          }}
        />
      </div>
    )
  );
}

const Transfer = ({
  setIsVisible,
}: {
  setIsVisible: (is: boolean) => void;
}) => {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        label="Address"
        placeholder="0xd2fdd21AC3553Ac578a69a64F833788f2581BF05"
        value={address}
        setValue={setAddress}
      />
      <Input
        label="Amount"
        placeholder="0.0"
        value={amount}
        setValue={setAmount}
      />
      <ActionButton text="Transfer" onClick={() => {}} />
      <Back
        onClick={() => {
          setIsVisible(false);
        }}
      />
    </div>
  );
};

const TokenSelector = () => {};

const ActionButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <button
      className="w-[8rem] h-[2rem] border-2 border-white flex justify-center items-center rounded-xl mx-auto cursor-pointer mt-5"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const Input = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: any;
  setValue: (any: any) => void;
}) => {
  return (
    <div className="flex flex-col">
      <p>{label}</p>
      <input
        className="w-[10rem] h-[2rem] border-2 border-white rounded-xl mx-auto"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

const Back = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="w-[8rem] h-[2rem] border-2 border-white flex justify-center items-center rounded-xl mx-auto cursor-pointer mt-5"
      onClick={onClick}
    >
      Back
    </button>
  );
};
