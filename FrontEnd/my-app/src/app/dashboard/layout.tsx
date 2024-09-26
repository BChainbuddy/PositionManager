import Header from "@/components/Header";
import { ThirdwebProvider } from "thirdweb/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThirdwebProvider>
      <Header />
      {children}
    </ThirdwebProvider>
  );
}
