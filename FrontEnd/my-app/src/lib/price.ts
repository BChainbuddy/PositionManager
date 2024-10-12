import { getV2Price, getV3Price } from "./getQuote";

export async function price(
  token1: string,
  token2: string,
  dexRouter: string,
  ABIType: number,
  fee: string,
  decimalsIn: number,
  decimalsOut: number
) {
  let price;

  if (ABIType == 1) {
    console.log("V3");
    price = await getV3Price(
      dexRouter,
      token1,
      token2,
      fee,
      decimalsIn,
      decimalsOut
    );
  } else {
    console.log("V2");
    price = await getV2Price(dexRouter, token1, token2);
  }

  return price;
}
