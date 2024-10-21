"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define types for the context
interface ForgeContextType {
  inputToken: any;
  setInputToken: Dispatch<SetStateAction<any>>;
  outputToken: any;
  setOutputToken: Dispatch<SetStateAction<any>>;
  routerAddress: string;
  setRouterAddress: Dispatch<SetStateAction<any>>;
  poolAddress: string;
  setPoolAddress: Dispatch<SetStateAction<any>>;
}

// Initialize context with undefined as the default value
const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

// Provider to wrap your app and share the transition state
export function ForgeContextProvider({ children }: { children: ReactNode }) {
  const [inputToken, setInputToken] = useState<any>("");
  const [outputToken, setOutputToken] = useState<any>("");
  const [poolAddress, setPoolAddress] = useState<string>("");
  const [routerAddress, setRouterAddress] = useState<string>("");

  return (
    <ForgeContext.Provider
      value={{
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
        setPoolAddress,
        poolAddress,
        routerAddress,
        setRouterAddress,
      }}
    >
      {children}
    </ForgeContext.Provider>
  );
}

// Hook to use the context in any component
export function useForge() {
  const context = useContext(ForgeContext);

  if (!context) {
    throw new Error("useForge must be used within a ForgeContextProvider");
  }

  return context;
}
