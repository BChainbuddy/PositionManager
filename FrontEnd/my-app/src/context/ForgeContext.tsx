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
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

export function ForgeContextProvider({ children }: { children: ReactNode }) {
  const [inputToken, setInputToken] = useState<any>("");
  const [outputToken, setOutputToken] = useState<any>("");
  const [dex, setDex] = useState<any>("");

  return (
    <ForgeContext.Provider
      value={{
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
        dex,
        setDex,
      }}
    >
      {children}
    </ForgeContext.Provider>
  );
}

// Hook
export function useForge() {
  const context = useContext(ForgeContext);

  if (!context) {
    throw new Error("useForge must be used within a ForgeContextProvider");
  }

  return context;
}
