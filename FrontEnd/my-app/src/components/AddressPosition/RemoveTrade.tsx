import { client } from "@/lib/client";
import { useState } from "react";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import CONTRACT_ADDRESSES from "@/data/contractAddresses.json";
import CircleLoading from "@/ui/CircleLoading";

export default function RemoveTrade({ positionId }: { positionId: number }) {
  const [txStatus, setTxStatus] = useState("idle");

  const account = useActiveAccount();

  const handleRemoveTrade = async () => {
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

      // 2. Prepare the transaction call
      const removeTx = prepareContractCall({
        contract,
        method: "function withdrawPosition(uint256 positionId)",
        params: [BigInt(positionId)],
      });

      // 3. Send the transaction
      setTxStatus("pending");

      const result = await sendTransaction({
        transaction: removeTx,
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
    <button
      className="h-10 w-36 bg-[#01FF39] rounded-lg text-black flex justify-center items-center"
      onClick={handleRemoveTrade}
    >
      {txStatus !== "pending" ? (
        <span>REMOVE TRADE</span>
      ) : (
        <CircleLoading height="h-4" width="w-4" innerColor="fill-[#FFFFFF]" />
      )}
    </button>
  );
}
