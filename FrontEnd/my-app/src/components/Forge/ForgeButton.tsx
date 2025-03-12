import { useAnimationControls, motion } from "framer-motion";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
} from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/client";
import { useActiveAccount } from "thirdweb/react";
import ForgeHammers from "./ForgeHammers";
import { useForge } from "@/context/ForgeContext";
import { useEffect, useState } from "react";
import CONTRACT_ADDRESSES from "@/data/contractAddresses.json";

export default function ForgeButton({ nextStep }: { nextStep: () => void }) {
  const controls = useAnimationControls();

  const account = useActiveAccount();

  const { inputToken, outputToken, parameters, dex, swapPrice, setTxHash } =
    useForge();

  const { mutate: forgeTx, isSuccess, data } = useSendTransaction();

  const handleClick = async () => {
    controls.start("forge");
    await createPosition();
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

  async function createPosition() {
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

      // 2. Get Fee
      const dailyFee = await readContract({
        contract: contract,
        method: "function getDailyPositionFee() view returns (uint256)",
      });

      // 3. Prepare the transaction call
      const forgeTransaction = prepareContractCall({
        contract,
        method:
          "function createPosition(address tokenIn, address tokenOut, uint256 quantity, uint256 swapPrice, address dexRouter, uint32 duration, uint8 condition) payable",
        params: [
          inputToken.address,
          outputToken.address,
          BigInt(parameters!.quantity * 10 ** inputToken.decimals),
          BigInt(parameters?.executionPrice ?? 0), // executionPrice in wei
          "0xee567fe1712faf6149d80da1e6934e354124cfe3", // dex router address
          parameters?.days ?? 0 * 86400, // duration in seconds
          parameters?.executionPrice ?? 0 > swapPrice ? 0 : 1, // 0 or 1 (enum index)
        ],
        value: dailyFee * BigInt(parameters?.days ?? 0),
      });

      // 4. Send the transaction
      forgeTx(forgeTransaction);
    } catch (error) {
      console.error("Error creating position:", error);
      throw error;
    }
  }

  useEffect(() => {
    if (isSuccess && data) {
      console.log("Success");
      console.log(data);
      setTxHash(data.transactionHash);
      nextStep();
    }
  }, [isSuccess, data]);

  return (
    <>
      <motion.button
        variants={buttonVariants}
        initial="initial"
        animate={controls}
        disabled={
          !parameters?.executionPrice ||
          !parameters?.days ||
          !parameters.quantity
        }
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
    </>
  );
}
