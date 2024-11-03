import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token1 = searchParams.get("token1");
  const token2 = searchParams.get("token2");
  const skip = searchParams.get("skip") ? searchParams.get("skip") : 0;

  if (!token1 || !token2) {
    return NextResponse.json({ error: "Tokens not inputed" }, { status: 400 });
  }

  // GraphQL query to find the pair ID for the given token addresses
  const pairQuery = `
        {
            pairs(
                where: {
                token0: "${token1.toLowerCase()}"
                token1: "${token2.toLowerCase()}"
                }
            ) {
                id
            }
        }
    `;

  try {
    // Fetch the pair ID first
    const pairResponse = await fetch(
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: pairQuery }),
      }
    );

    const pairData = await pairResponse.json();
    const pairId = pairData.data.pairs[0]?.id;

    if (!pairId) {
      return NextResponse.json({ error: "Pair not found" }, { status: 400 });
    }

    // Fetch hourly data for the found pair ID
    const hourlyDataQuery = `
        {
            pairHourDatas(
            where: { pair: "${pairId}" }
            orderBy: hourStartUnix
            orderDirection: desc
            first: 1000
            skip: ${skip}
            ) {
            hourStartUnix
            hourlyVolumeUSD
            reserveUSD
            hourlyVolumeToken0
            hourlyVolumeToken1
            token0 {
                symbol
            }
            token1 {
                symbol
            }
            }
        }
    `;

    const hourlyResponse = await fetch(
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: hourlyDataQuery }),
      }
    );

    const hourlyData = await hourlyResponse.json();
    return NextResponse.json(hourlyData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
