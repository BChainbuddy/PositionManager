"use client";
import { createContext, useContext, useState } from "react";

// Create the context
const PageTransitionContext = createContext({
  showTransition: false,
  triggerTransition: () => {},
});

// Provider to wrap your app and share the transition state
export function PageTransitionProvider({ children }: any) {
  const [showTransition, setShowTransition] = useState(false);

  const triggerTransition = () => {
    setShowTransition(true);
    setTimeout(() => setShowTransition(false), 1500);
  };

  return (
    <PageTransitionContext.Provider
      value={{ showTransition, triggerTransition }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

// Hook to use the context in any component
export function usePageTransition() {
  return useContext(PageTransitionContext);
}
