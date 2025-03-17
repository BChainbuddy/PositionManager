import { client } from "@/lib/client";
import { useState } from "react";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
  readContract,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import CONTRACT_ADDRESSES from "@/data/contractAddresses.json";
import CircleLoading from "@/ui/CircleLoading";

export default function ProlongTrade({ positionId }: { positionId: number }) {
  const [days, setDays] = useState<number>(1);
  const [txStatus, setTxStatus] = useState("idle");

  const account = useActiveAccount();

  const handleProlongPosition = async () => {
    try {
      if (!account) {
        throw new Error("No connected account");
      }
      // 1. Get the contract instance
      const contract = getContract({
        client: client,
        address: CONTRACT_ADDRESSES["11155111"] as unknown as string,
        chain: sepolia,
      });

      // 2. Get the daily fee
      const dailyFee = await readContract({
        contract: contract,
        method: "function getDailyPositionFee() view returns (uint256)",
      });

      // 3. Prepare the transaction call
      const prolongTx = prepareContractCall({
        contract,
        method:
          "function prolongPosition(uint256 positionId, uint32 duration) payable",
        params: [BigInt(positionId), days],
        value: dailyFee * BigInt(days),
      });

      // 4. Send the transaction
      setTxStatus("pending");

      const result = await sendTransaction({
        transaction: prolongTx,
        account: account,
      });

      console.log("Transaction sent, hash:", result.transactionHash);

      // 5. Wait for receipt
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
    <div className="flex flex-row space-x-3 items-center justify-center">
      <input
        onChange={(e) => {
          if (Number(e.target.value) > 0) {
            setDays(Number(e.target.value));
          }
        }}
        type="number"
        value={days}
        className="text-black w-[3rem] rounded-lg p-1 outline-none"
      />
      <p>days</p>
      <button
        className="h-8 px-4 bg-[#01FF39] rounded-lg text-black"
        onClick={handleProlongPosition}
        disabled={txStatus === "pending"}
      >
        {txStatus !== "pending" ? (
          <span>ADD</span>
        ) : (
          <CircleLoading height="h-4" width="w-4" innerColor="fill-[#FFFFFF]" />
        )}
      </button>
    </div>
  );
}
