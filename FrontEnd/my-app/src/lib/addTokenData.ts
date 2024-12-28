import TOKEN_IMAGES from "@/data/tokenImages.json";
import { Position } from "@/components/Dashboard/OpenPositions";
import { price } from "./price";

const TOKEN_IMAGES_TYPED: Record<string, string> = TOKEN_IMAGES as Record<
  string,
  string
>;

export default async function addTokenData(data: { positions: Position[] }) {
  const updatedPositions = await Promise.all(
    data.positions.map(async (position: Position) => {
      return {
        ...position,
        imgIn: TOKEN_IMAGES_TYPED[position.tokenIn.address]
          ? TOKEN_IMAGES_TYPED[position.tokenIn.address]
          : "",
        imgOut: TOKEN_IMAGES_TYPED[position.tokenOut.address]
          ? TOKEN_IMAGES_TYPED[position.tokenOut.address]
          : "",
        price: await price(
          position.tokenIn.address,
          position.tokenOut.address,
          position.dexRouter.id,
          position.forkABI,
          position.fee,
          position.tokenIn.decimals,
          position.tokenOut.decimals
        ),
      };
    })
  );
  return updatedPositions;
}
