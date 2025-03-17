import { NextResponse } from "next/server";
import { createClient, gql } from "urql";
import { cacheExchange, fetchExchange } from "@urql/core";

const client = createClient({
  url: `https://gateway.thegraph.com/api/${process.env.GRAPH_APIKEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`,

  exchanges: [cacheExchange, fetchExchange],
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token1 = searchParams.get("token1");
  const token2 = searchParams.get("token2");
  console.log("key", process.env.GRAPH_APIKEY);
  const skip = searchParams.get("skip") ? searchParams.get("skip") : 0;

  if (!token1 || !token2) {
    return NextResponse.json({ error: "Tokens not inputed" }, { status: 400 });
  }

  // GraphQL query to find the pair ID for the given token addresses
  const pairQuery = `
        {
            pools(
                where: {
                token0: ${token1.toLowerCase()}
                token1: ${token2.toLowerCase()}
                }
            ) {
                id
            }
        }
    `;
  // const result = await client
  //   .query(pairQuery, {
  //     token0: token1.toLowerCase(),
  //     token1: token2.toLowerCase(),
  //   })
  //   .toPromise();
  // console.log("TRIED CALLING");
  // console.log(result);

  try {
    // Fetch the pair ID first
    // const PAIR_QUERY = gql`
    //   {
    //     pools(where: { token0: "0xToken0Address", token1: "0xToken1Address" }) {
    //       id
    //     }
    //   }
    // `;
    const result = await client
      .query(pairQuery, {
        token0: token1.toLowerCase(),
        token1: token2.toLowerCase(),
      })
      .toPromise();
    console.log("TRIED CALLING");
    console.log(result);
    // const pairId = pairData.data.pairs[0]?.id;
    // if (!pairId) {
    //   return NextResponse.json({ error: "Pair not found" }, { status: 400 });
    // }
    // // Fetch hourly data for the found pair ID
    // const hourlyDataQuery = `
    // {
    //     pairHourDatas(
    //     where: { pair: "${pairId}" }
    //     orderBy: hourStartUnix
    //     orderDirection: desc
    //     first: 1000
    //     skip: ${skip}
    //     ) {
    //     hourStartUnix
    //     hourlyVolumeUSD
    //     reserveUSD
    //     hourlyVolumeToken0
    //     hourlyVolumeToken1
    //     token0 {
    //         symbol
    //     }
    //     token1 {
    //         symbol
    //     }
    //     }
    // }
    // `;
    // const hourlyResponse = await fetch(
    //   "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ query: hourlyDataQuery }),
    //   }
    // );
    // const hourlyData = await hourlyResponse.json();
    // return NextResponse.json(hourlyData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
