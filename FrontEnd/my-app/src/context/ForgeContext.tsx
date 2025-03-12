"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ForgeContextType {
  inputToken: any;
  setInputToken: Dispatch<SetStateAction<any>>;
  outputToken: any;
  setOutputToken: Dispatch<SetStateAction<any>>;
  dex: any;
  setDex: Dispatch<SetStateAction<any>>;
  setParameters: Dispatch<SetStateAction<ParametersType>>;
  parameters: ParametersType | undefined;
  setSwapPrice: Dispatch<SetStateAction<number>>;
  swapPrice: number;
  txHash: string;
  setTxHash: Dispatch<SetStateAction<string>>;
}

interface ParametersType {
  days: number;
  executionPrice: number;
  quantity: number;
  fee: bigint;
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

export function ForgeContextProvider({ children }: { children: ReactNode }) {
  const [inputToken, setInputToken] = useState<any>("");
  const [outputToken, setOutputToken] = useState<any>("");
  const [dex, setDex] = useState<any>("");
  const [txHash, setTxHash] = useState<string>("");
  const [parameters, setParameters] = useState<ParametersType>({
    days: 0,
    executionPrice: 0,
    quantity: 0,
    fee: 0n,
  });
  const [swapPrice, setSwapPrice] = useState<number>(0);

  return (
    <ForgeContext.Provider
      value={{
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
        dex,
        setDex,
        setParameters,
        parameters,
        setSwapPrice,
        swapPrice,
        txHash,
        setTxHash,
      }}
    >
      {children}
    </ForgeContext.Provider>
  );
}

export function useForge() {
  const context = useContext(ForgeContext);

  if (!context) {
    throw new Error("useForge must be used within a ForgeContextProvider");
  }

  return context;
}
