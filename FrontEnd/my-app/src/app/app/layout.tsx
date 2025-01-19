"use client";

import ShadowBorders from "@/ui/ShadowBorders";
import Header from "@/components/Header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/ApolloClient";

// const smartWalletOptions = {
//   factoryAddress: "0x48000619893550507CB323Cc42838f370fAB1B84",
//   gasless: true,
// };

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
        <ApolloProvider client={apolloClient}>
          <Header />
          {children}
          <ShadowBorders />
        </ApolloProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
