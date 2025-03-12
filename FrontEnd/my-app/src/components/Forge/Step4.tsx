import { useForge } from "@/context/ForgeContext";
import { client } from "@/lib/client";
import { useEffect, useState } from "react";
import { Address, waitForReceipt } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { MdCheck, MdClear } from "react-icons/md";
import { motion } from "framer-motion";
import Button from "@/ui/Button";

interface Step4Props {
  step: number;
  previousStep: () => void;
}

export default function Step4({ step, previousStep }: Step4Props) {
  const { txHash } = useForge();

  const [txStatus, setTxStatus] = useState("pending");

  const getReceipt = async () => {
    // 1. Wait for receipt
    const receipt = await waitForReceipt({
      client,
      chain: sepolia,
      transactionHash: txHash as Address,
    });
    console.log("Receipt received:", receipt);

    if (receipt.status === "success") {
      setTxStatus("success");
      console.log("Transaction confirmed:", receipt);
    } else {
      setTxStatus("failed");
      console.error("Transaction failed:", receipt);
    }
  };

  useEffect(() => {
    if (txHash) {
      getReceipt();
    }
  }, [txHash]);

  return (
    <>
      {step === 3 && (
        <div
          className={`h-full w-full flex flex-col text-white justify-center items-center font-juraBold transition-all duration-1000 absolute mx-auto ${
            step > 3
              ? "duration-500 opacity-0 z-10"
              : step === 3
              ? "opacity-100 z-20 delay-500"
              : "opacity-0 translate-x-10 z-10"
          }`}
        >
          <p className="text-center text-[#01FF39] text-xl max-w-[90%]">
            {txStatus === "pending"
              ? "Waiting for transaction confirmation"
              : txStatus === "success"
              ? "Transaction confirmed!"
              : "Transaction failed."}
          </p>
          <div className="mt-4">
            {txStatus === "pending" && <LoadingDots />}
            {txStatus === "success" && (
              <MdCheck className="text-green-500 text-4xl" />
            )}
            {txStatus === "failed" && (
              <MdClear className="text-red-500 text-4xl" />
            )}
          </div>
          {txStatus === "success" && (
            <Button title="POSITIONS" href="/app/positions"></Button>
          )}
          {txStatus === "failed" && (
            <button
              className="text-sm flex items-center justify-center h-6 w-12 bg-white text-black rounded-2xl mt-2"
              onClick={previousStep}
            >
              back
            </button>
          )}
        </div>
      )}
    </>
  );
}

function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <motion.span
        className="text-2xl"
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
      >
        .
      </motion.span>
      <motion.span
        className="text-2xl"
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
      >
        .
      </motion.span>
      <motion.span
        className="text-2xl"
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0.4 }}
      >
        .
      </motion.span>
    </div>
  );
}
