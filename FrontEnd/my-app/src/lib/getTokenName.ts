import { polygon } from "thirdweb/chains";
import { client } from "./client";
import { getContract } from "thirdweb";

export async function getTokenName(tokenAddress: string) {
  try {
    // Get the contract instance for the given token address
    const contract = client.getContract({
      address: tokenAddress,
      chain: polygon,
    });

    // Fetch the token name
    const tokenName = await contract.erc20.name();
    return tokenName;
  } catch (error) {
    console.error("Failed to fetch token name:", error);
    return null;
  }
}
