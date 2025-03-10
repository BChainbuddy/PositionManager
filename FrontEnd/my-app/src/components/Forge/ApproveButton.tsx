import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { ethers } from "ethers";
import { client } from "@/lib/client";
import { Abi } from "thirdweb/utils";
import { useActiveAccount } from "thirdweb/react";
import { useForge } from "@/context/ForgeContext";
import ERC20Abi from "@/data/ERC20Abi.json";
import CONTRACT_ADDRESSES from "@/data/contractAddresses.json";

export default function ApproveButton() {
  const account = useActiveAccount();

  const { inputToken, parameters } = useForge();

  async function approve() {
    if (!account || !inputToken || !parameters?.quantity) return;

    try {
      // 1. Get the token contract
      const tokenContract = getContract({
        client: client,
        address: inputToken.address,
        chain: sepolia,
        abi: ERC20Abi as Abi,
      });

      // 2. Calculate required allowance
      const requiredAllowance = ethers.parseUnits(
        parameters.quantity.toString(),
        inputToken.decimals
      );

      // 3. If insufficient allowance, create approval
      const approveTx = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [
          CONTRACT_ADDRESSES["11155111"] as unknown as string,
          requiredAllowance,
        ],
      });

      const approvalResult = await sendTransaction({
        transaction: approveTx,
        account: account,
      });

      console.log("Approval tx hash:", approvalResult.transactionHash);
    } catch (error) {
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
          !parameters.quantity
        }
        className={`flex items-center justify-center h-8 w-24 rounded-2xl text-black mt-3 ${
          parameters?.executionPrice && parameters?.days && parameters.quantity
            ? "bg-[#01FF39]"
            : "bg-[#01FF3980]"
        }`}
        onClick={approve}
      >
        APPROVE
      </button>
    </div>
  );
}
