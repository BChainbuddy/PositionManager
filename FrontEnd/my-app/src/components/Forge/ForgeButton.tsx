import { useAnimationControls, motion } from "framer-motion";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { ethers } from "ethers";
import { client } from "@/lib/client";
import CONTRACT_ABI from "@/data/abi.json";
import { Abi } from "thirdweb/utils";
import { useActiveAccount } from "thirdweb/react";
import ForgeHammers from "./ForgeHammers";
import { useForge } from "@/context/ForgeContext";

export default function ForgeButton() {
  const controls = useAnimationControls();

  const handleClick = () => {
    controls.start("forge");
  };

  const buttonVariants = {
    initial: { boxShadow: "0px 0px 0px rgba(1, 255, 57, 1)" },
    forge: {
      boxShadow: [
        "0px 0px 0px rgba(1, 255, 57, 1)",
        "0px 0px 0px rgba(1, 255, 57, 1)",
        "0px 0px 20px rgba(1, 255, 57, 1)",
        "0px 0px 20px rgba(1, 255, 57, 1)",
        "0px 0px 0px rgba(1, 255, 57, 1)",
      ],
      transition: {
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.7, 0.7, 0.9, 1],
      },
    },
  };

  const account = useActiveAccount();

  const { inputToken, outputToken, parameters, dex, swapPrice } = useForge();

  async function createPosition() {
    try {
      if (!account) {
        throw new Error("No connected account");
      }

      // 1. Get the contract instance
      const contract = getContract({
        client: client,
        address: "YOUR_CONTRACT_ADDRESS",
        chain: sepolia,
        abi: CONTRACT_ABI as Abi, // Import or define your contract ABI
      });

      // 2. Prepare the transaction call
      const transaction = prepareContractCall({
        contract,
        method:
          "function createPosition(address tokenIn, address tokenOut, uint256 quantity, uint256 swapPrice, address dexRouter, uint32 duration, uint8 condition) payable",
        params: [
          inputToken.address,
          outputToken.address,
          ethers.parseUnits(
            parameters?.quantity.toString() ?? "0",
            inputToken.decimals
          ), // quantity in wei
          ethers.parseUnits(parameters?.executionPrice.toString() ?? "0", 18), // executionPrice in wei
          dex, // dex router address
          parameters?.days ?? 0 * 86400, // duration in seconds
          parameters?.executionPrice ?? 0 > swapPrice ? 0 : 1, // 0 or 1 (enum index)
        ],
        value: BigInt(1000000000000000) * BigInt(parameters?.days ?? 0),
      });

      // 3. Send the transaction
      const result = await sendTransaction({
        transaction,
        account: account,
      });

      console.log("Transaction submitted:", result.transactionHash);
      return result;
    } catch (error) {
      console.error("Error creating position:", error);
      throw error;
    }
  }

  return (
    <div className="relative w-24">
      <motion.button
        variants={buttonVariants}
        initial="initial"
        animate={controls}
        disabled={!parameters?.executionPrice || !parameters?.days}
        className={`flex items-center justify-center h-8 w-24 rounded-2xl text-black mt-3 ${
          parameters?.executionPrice && parameters?.days
            ? "bg-[#01FF39]"
            : "bg-[#01FF3980]"
        }`}
        onClick={handleClick}
      >
        FORGE
      </motion.button>
      <ForgeHammers controls={controls} />
    </div>
  );
}
