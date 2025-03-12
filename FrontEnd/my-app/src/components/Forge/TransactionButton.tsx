import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/client";
import { Abi } from "thirdweb/utils";
import { useActiveAccount } from "thirdweb/react";
import { useForge } from "@/context/ForgeContext";
import ERC20Abi from "@/data/ERC20Abi.json";
import CONTRACT_ADDRESSES from "@/data/contractAddresses.json";
import { useEffect, useState } from "react";
import ForgeButton from "./ForgeButton";
import ApproveButton from "./ApproveButton";

export default function TransactionButton({
  nextStep,
}: {
  nextStep: () => void;
}) {
  const [allowance, setAllowance] = useState<number>(0);

  const account = useActiveAccount();

  const { inputToken, parameters } = useForge();

  async function getAllowance() {
    if (!account || !inputToken || !parameters?.quantity) return;

    try {
      // 1. Get the token contract
      const tokenContract = getContract({
        client: client,
        address: inputToken.address,
        chain: sepolia,
        abi: ERC20Abi as Abi,
      });

      // 2. Get current allowance
      const currentAllowance = await readContract({
        contract: tokenContract,
        method:
          "function allowance(address owner, address spender) view returns (uint256)",
        params: [
          account.address,
          CONTRACT_ADDRESSES["11155111"] as unknown as string,
        ],
      });

      setAllowance(Number(currentAllowance));
    } catch (error) {
      console.error("Approval failed:", error);
      throw error;
    }
  }

  useEffect(() => {
    if (account && parameters?.quantity) {
      getAllowance();
    }
  }, [account, parameters?.quantity]);

  return (
    <div className="relative w-24">
      {parameters?.quantity &&
      Number(allowance) >= parameters?.quantity * 10 ** inputToken.decimals ? (
        <ForgeButton nextStep={nextStep} />
      ) : (
        <ApproveButton />
      )}
    </div>
  );
}
