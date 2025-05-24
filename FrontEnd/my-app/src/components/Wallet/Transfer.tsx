import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { ActionButton, Token } from "./WalletModal";
import {
  Address,
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { client } from "@/lib/client";
import { sepolia } from "thirdweb/chains";

export default function Transfer({
  setIsVisible,
  tokens,
}: {
  setIsVisible: (is: boolean) => void;
  tokens: Token[];
}) {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [txStatus, setTxStatus] = useState("idle");

  const account = useActiveAccount();

  const Transfer = async () => {
    try {
      if (!account) {
        throw new Error("No connected account");
      }
      // 1. Get the contract instance
      const contract = getContract({
        client: client,
        address: selectedToken?.address as Address,
        chain: sepolia,
      });
      // 2. Prepare the transaction call
      const transferTx = prepareContractCall({
        contract,
        method:
          "function transfer(address recipient, uint256 amount) external returns (bool)",
        params: [
          address,
          BigInt(amount * 10 ** (selectedToken?.decimals ?? 0)),
        ],
      });
      // 3. Send the transaction
      setTxStatus("pending");

      const result = await sendTransaction({
        transaction: transferTx,
        account: account,
      });

      console.log("Transaction sent, hash:", result.transactionHash);

      // 4. Wait for receipt
      const receipt = await waitForReceipt({
        client,
        chain: sepolia,
        transactionHash: result.transactionHash,
      });

      if (receipt.status === "success") {
        setTxStatus("success");
        console.log("Transaction confirmed:", receipt);
      } else {
        setTxStatus("failed");
        console.error("Transaction failed:", receipt);
      }
    } catch (error) {
      setTxStatus("idle");

      console.error("Approval failed:", error);
      throw error;
    }
  };

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
            className="text-xs md:text-sm absolute right-2 top-[1.3rem] md:top-[1.6rem] z-40"
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
        <ActionButton
          text="Transfer"
          onClick={Transfer}
          disabled={!address || !amount || !selectedToken}
          isPending={txStatus === "pending"}
        />
      </div>
      <ActionButton
        text="Back"
        className="w-[4rem]"
        onClick={() => setIsVisible(false)}
      />
    </>
  );
}

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
      <p className="font-juraBold text-xs md:text-sm">{label}</p>
      <input
        className={`w-[12rem] rounded-md mx-auto px-2 py-1 text-black outline-none focus:outline-green-500 focus:outline-1 text-xs md:text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
