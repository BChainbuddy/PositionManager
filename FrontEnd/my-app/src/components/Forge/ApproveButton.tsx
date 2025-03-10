import {
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/client";
import { useActiveAccount } from "thirdweb/react";
import { useForge } from "@/context/ForgeContext";
import CONTRACT_ADDRESSES from "@/data/contractAddresses.json";
import CircleLoading from "@/ui/CircleLoading";
import { useState } from "react";

export default function ApproveButton() {
  const account = useActiveAccount();

  const { inputToken, parameters } = useForge();

  const [txStatus, setTxStatus] = useState("idle");

  async function approve() {
    if (!account || !inputToken || !parameters?.quantity) return;

    try {
      // 1. Get the token contract
      const tokenContract = getContract({
        client: client,
        address: inputToken.address,
        chain: sepolia,
      });

      // 2. Calculate required allowance
      const requiredAllowance = parameters.quantity * 10 ** inputToken.decimals;

      // 3. Create approval
      const approveTx = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [
          CONTRACT_ADDRESSES["11155111"] as unknown as string,
          BigInt(requiredAllowance),
        ],
        value: BigInt(0),
      });
      setTxStatus("pending");

      const result = await sendTransaction({
        transaction: approveTx,
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
  }

  return (
    <div className="relative w-24">
      <button
        disabled={
          !parameters?.executionPrice ||
          !parameters?.days ||
          !parameters.quantity ||
          txStatus === "pending"
        }
        className={`flex items-center justify-center h-8 w-24 rounded-2xl text-black mt-3 ${
          parameters?.executionPrice && parameters?.days && parameters.quantity
            ? "bg-[#01FF39]"
            : "bg-[#01FF3980]"
        }`}
        onClick={approve}
      >
        {txStatus != "pending" ? (
          <span>APPROVE</span>
        ) : (
          <CircleLoading height="h-4" width="w-4" innerColor="fill-[#FFFFFF]" />
        )}
      </button>
    </div>
  );
}
