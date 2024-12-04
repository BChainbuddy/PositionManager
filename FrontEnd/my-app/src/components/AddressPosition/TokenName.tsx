// TokenName.tsx
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";

interface TokenNameProps {
  tokenAddress: string;
}

const TokenName = ({ tokenAddress }: TokenNameProps) => {
  const [tokenName, setTokenName] = useState<string | null>(null);

  const contract = getContract({
    client,
    address: tokenAddress,
    chain: { rpc: "https://polygon-rpc.com", id: 137 },
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method: "function name() view returns (string)",
  });

  useEffect(() => {
    if (data) {
      setTokenName(data as string);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Token Name: {tokenName}</p>;
};

export default TokenName;
