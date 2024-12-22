"use client";

import PageTransition from "@/ui/PageTransition";
import Header from "@/components/Header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
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
          <PageTransitionProvider>
            <Header />
            {children}
            <PageTransition />
          </PageTransitionProvider>
        </ApolloProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
