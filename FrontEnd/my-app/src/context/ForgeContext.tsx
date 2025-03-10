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
}

interface ParametersType {
  days: number;
  executionPrice: number;
  quantity: number;
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

export function ForgeContextProvider({ children }: { children: ReactNode }) {
  const [inputToken, setInputToken] = useState<any>("");
  const [outputToken, setOutputToken] = useState<any>("");
  const [dex, setDex] = useState<any>("");
  const [parameters, setParameters] = useState<ParametersType>({
    days: 0,
    executionPrice: 0,
    quantity: 0,
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
