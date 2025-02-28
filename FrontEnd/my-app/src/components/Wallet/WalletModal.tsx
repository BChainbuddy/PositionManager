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

interface Token {
  symbol: string;
  balance: number;
  address: string;
  name: string;
  decimals: number;
  logo: string;
}

export default function WalletModal({
  showModal,
  setSigner,
  setViewModal,
}: WalletModalProps) {
  const [transfer, setTransfer] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Token[]>([]);

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
      const tokenArray: Token[] = data.data.map((token: any) => {
        return {
          symbol: token.symbol,
          balance: token.balance,
          address: token.address,
          name: token.name,
          decimals: token.decimals,
          logo: token.logo,
        };
      });
      setTokens(tokenArray);
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
          <Transfer setIsVisible={setTransfer} tokens={tokens} />
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
  tokens,
}: {
  setIsVisible: (is: boolean) => void;
  tokens: Token[];
}) => {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  return (
    <div className="flex flex-col gap-y-5 mb-2">
      <TokenSelector
        tokens={tokens}
        setSelectedToken={setSelectedToken}
        selectedToken={selectedToken}
      />
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
      <ActionButton
        text="Back"
        className="w-[4rem]"
        onClick={() => setIsVisible(false)}
      />
    </div>
  );
};

const TokenSelector = ({
  tokens,
  setSelectedToken,
  selectedToken,
}: {
  tokens: Token[];
  setSelectedToken: (token: Token) => void;
  selectedToken: Token | null;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="relative flex mt-5">
      <button
        className="w-[8rem] h-[2rem] border-2 border-white flex justify-center items-center rounded-xl mx-auto cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <p>{selectedToken ? selectedToken.symbol : "Select Token"}</p>
      </button>
      {open && (
        <div className="absolute gap-y-5 border-white border-2 bg-black p-5 rounded-xl z-50 w-full">
          <div className="flex flex-row justify-between mb-1">
            <p className="text-sm text-white font-juraBold">Symbol</p>
            <p className="text-sm text-white font-juraBold">Balance</p>
          </div>
          {tokens.map((token, i) => (
            <div
              key={i}
              className="flex flex-row justify-between cursor-pointer mt-1"
              onClick={() => {
                setSelectedToken(token);
                setOpen(false);
              }}
            >
              <p>{token.symbol}</p>
              <p>{token.balance / 10 ** token.decimals}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ActionButton = ({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      className={`h-[2rem] border-2 border-white flex justify-center items-center rounded-xl mx-auto cursor-pointer ${
        className ? className : "w-[8rem]"
      }`}
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
      <p className="font-juraBold text-sm">{label}</p>
      <input
        className="w-[12rem] rounded-lg mx-auto px-2 py-1 text-black outline-none focus:outline-green-500 focus:outline-1 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
