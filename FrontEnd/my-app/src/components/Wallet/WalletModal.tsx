import { useEffect, useState } from "react";
import { sepolia } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useWalletBalance,
} from "thirdweb/react";
import { client } from "@/lib/client";
import { FaRegCopy } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";

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
  const [balance, setBalance] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const { disconnect } = useDisconnect();

  const { data, isLoading } = useWalletBalance({
    chain: sepolia,
    address: account?.address,
    client: client,
  });

  useEffect(() => {
    async function getBalances() {
      const response = await fetch(`/api/walletBalances/${account?.address}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();

      const tokenArray: Token[] = data.data.map((token: any) => {
        return {
          symbol: token.symbol,
          balance: token.balance,
          address: token.token_address,
          name: token.name,
          decimals: token.decimals,
          logo: token.logo ? token.logo : "",
        };
      });
      setTokens(tokenArray);
    }
    if (account?.address) {
      getBalances();
    }
  }, [account]);

  const formatBalance = (balance: number) => {
    if (balance < 1) {
      return balance.toFixed(8);
    }
    return balance.toFixed(4);
  };

  return (
    showModal &&
    wallet && (
      <div
        className={`fixed z-30 left-1/2 top-1/2 text-center rounded-2xl py-6 w-[20rem] px-8 h-[25rem] flex flex-col ${
          showModal ? "block connectModal" : "hidden"
        }`}
      >
        <h1 className="text-3xl font-juraBold">WALLET</h1>
        {!transfer && !balance ? (
          <div className="flex flex-col justify-between flex-1 h-full">
            <div className="mt-7">
              <p className="border-b border-white w-fit px-2 text-center mx-auto">
                ETH balance
              </p>
              <p>{formatBalance(Number(data?.displayValue) ?? 0)}</p>
              <p className="border-b border-white w-fit px-2 text-center mx-auto mt-5">
                Address
              </p>
              <div className="flex flex-row justify-center mt-1">
                <p className="text-xs">
                  {account?.address.substring(0, 12) +
                    "..." +
                    account?.address.substring(
                      account?.address.length - 6,
                      account.address.length
                    )}
                </p>
                <CopyWalletAddress walletAddress={account?.address ?? ""} />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 mt-2">
              <ActionButton text="Transfer" onClick={() => setTransfer(true)} />
              <ActionButton text="Balance" onClick={() => setBalance(true)} />
              <ActionButton
                text="Disconnect"
                onClick={() => {
                  disconnect(wallet);
                  setViewModal(false);
                }}
              />
            </div>
          </div>
        ) : transfer ? (
          <Transfer setIsVisible={setTransfer} tokens={tokens} />
        ) : (
          <Balance setIsVisible={setBalance} tokens={tokens} />
        )}
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
    <>
      <div className="flex flex-col flex-1 justify-evenly">
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
        <div className="relative w-fit mx-auto">
          <Input
            label="Amount"
            placeholder="0.0"
            value={amount}
            setValue={setAmount}
            className="pr-[2.3rem]"
          />
          <div
            className="absolute right-2 top-[1.6rem] z-40"
            onClick={() => {
              setAmount(
                selectedToken?.balance
                  ? selectedToken?.balance / 10 ** selectedToken?.decimals
                  : 0
              );
            }}
          >
            <p className="text-xs cursor-pointer text-green-600 font-semibold">
              max
            </p>
          </div>
        </div>
        <ActionButton text="Transfer" onClick={() => {}} />
      </div>
      <ActionButton
        text="Back"
        className="w-[4rem]"
        onClick={() => setIsVisible(false)}
      />
    </>
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
    <div className="relative flex">
      <button
        className="w-[8rem] h-[2rem] border-2 border-white flex justify-center items-center rounded-xl mx-auto cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <p>{selectedToken ? selectedToken.symbol : "Select Token"}</p>
      </button>
      {open && (
        <div className="absolute flex flex-col border-white border-2 bg-black p-5 rounded-xl z-50 w-full h-[15rem]">
          <div className="flex flex-row justify-between mb-1">
            <p className="text-sm text-white font-juraBold">Symbol</p>
            <p className="text-sm text-white font-juraBold">Balance</p>
          </div>
          <div className="overflow-y-scroll flex-1">
            {tokens.map((token, i) => (
              <div
                key={i}
                className="flex flex-row justify-between cursor-pointer mt-1 group pr-1"
                onClick={() => {
                  setSelectedToken(token);
                  setOpen(false);
                }}
              >
                <p className="text-sm group-hover:text-[#ffe500] transition-all duration-300 ease-out">
                  {token.symbol}
                </p>
                <p className="text-sm group-hover:text-[#ffe500] transition-all duration-300 ease-out">
                  {token.balance / 10 ** token.decimals}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Balance = ({
  tokens,
  setIsVisible,
}: {
  tokens: Token[];
  setIsVisible: (is: boolean) => void;
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-1 mt-2">
      <div className="flex flex-row justify-between mb-1">
        <p className="font-juraBold text-sm">Token</p>
        <p className="font-juraBold text-sm">Balance</p>
      </div>
      <div className="flex flex-col gap-y-2 py-2 flex-1 h-full overflow-y-scroll border-y border-white">
        {tokens.map((token, i) => (
          <>
            <div key={i} className="flex flex-col pr-2 group">
              <div className="flex flex-row justify-between">
                <p className="text-sm group-hover:text-[#ffe500] transition-all duration-300 ease-out">
                  {token.symbol}
                </p>
                <p className="text-sm group-hover:text-[#ffe500] transition-all duration-300 ease-out">
                  {token.balance / 10 ** token.decimals}
                </p>
              </div>
              <p className="text-[0.8rem] group-hover:text-[#ffe500] transition-all duration-300 ease-out text-left">
                {token.address.substring(0, 12) +
                  "..." +
                  token.address.substring(
                    token.address.length - 6,
                    token.address.length
                  )}
              </p>
            </div>
            {i !== tokens.length - 1 && <div className="border-b"></div>}
          </>
        ))}
      </div>
      <ActionButton
        text="Back"
        className="w-[4rem] mt-2"
        onClick={() => setIsVisible(false)}
      />
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
  className,
}: {
  label: string;
  placeholder: string;
  value: any;
  setValue: (any: any) => void;
  className?: string;
}) => {
  return (
    <div className="flex flex-col relative z-20">
      <p className="font-juraBold text-sm">{label}</p>
      <input
        className={`w-[12rem] rounded-md mx-auto px-2 py-1 text-black outline-none focus:outline-green-500 focus:outline-1 text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

const CopyWalletAddress = ({ walletAddress }: { walletAddress: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 5000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className={`cursor-pointer ml-2`} onClick={copyToClipboard}>
      {copied ? (
        <AiOutlineCheck className="text-green-500 text-sm" />
      ) : (
        <FaRegCopy className="text-white text-sm" />
      )}
    </div>
  );
};
