// TokenName.tsx
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { polygon } from "thirdweb/chains";

interface TokenSymbolProps {
  tokenAddress: string;
  className: string;
}

export default function TokenSymbol({
  tokenAddress,
  className,
}: TokenSymbolProps) {
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);

  const contract = getContract({
    client,
    address: tokenAddress,
    chain: polygon,
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method: "function symbol() view returns (string)",
  });

  useEffect(() => {
    if (data) {
      setTokenSymbol(data as string);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p className={className}>{tokenSymbol}</p>;
}
