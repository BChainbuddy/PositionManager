import { NextResponse } from "next/server";

const API_KEY = process.env.MORALIS_API_KEY || "";
const CHAIN = "sepolia";

export async function GET(
  req: Request,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const { walletAddress } = params;

    const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=${CHAIN}`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data from Moralis:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet balances" },
      { status: 500 }
    );
  }
}
