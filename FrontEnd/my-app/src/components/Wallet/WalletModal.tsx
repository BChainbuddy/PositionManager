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
import Transfer from "./Transfer";
import CircleLoading from "@/ui/CircleLoading";

interface WalletModalProps {
  showModal: boolean;
  setSigner: (s: any) => any;
  setViewModal: (show: boolean) => any;
}

export interface Token {
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

export const ActionButton = ({
  text,
  onClick,
  className,
  disabled = false,
  isPending = false,
}: {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  isPending?: boolean;
}) => {
  return (
    <button
      className={`h-[2rem] border-2 border-white flex justify-center items-center rounded-xl mx-auto cursor-pointer ${
        className ? className : "w-[8rem]"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {!isPending ? (
        <span>{text}</span>
      ) : (
        <CircleLoading height="h-4" width="w-4" innerColor="fill-[#FFFFFF]" />
      )}
    </button>
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
