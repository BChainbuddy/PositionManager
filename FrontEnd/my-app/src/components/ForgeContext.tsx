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
}

// Initialize context with undefined as the default value
const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

// Provider to wrap your app and share the transition state
export function ForgeContextProvider({ children }: { children: ReactNode }) {
  const [inputToken, setInputToken] = useState<any>(null);
  const [outputToken, setOutputToken] = useState<any>(null);

  return (
    <ForgeContext.Provider
      value={{ inputToken, setInputToken, outputToken, setOutputToken }}
    >
      {children}
    </ForgeContext.Provider>
  );
}

// Hook to use the context in any component
export function usePageTransition() {
  const context = useContext(ForgeContext);

  if (!context) {
    throw new Error(
      "usePageTransition must be used within a ForgeContextProvider"
    );
  }

  return context;
}
