"use client";

import Header from "@/components/Header";
import { embeddedWallet, smartWallet } from "@thirdweb-dev/react";
import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";

const smartWalletOptions = {
  factoryAddress: "0x48000619893550507CB323Cc42838f370fAB1B84",
  gasless: true,
};

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <Header />
        {children}
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
