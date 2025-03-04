import { TOKEN_IMAGES } from "@/data/tokenImages";
import { Position } from "@/components/Dashboard/OpenPositions";
import { price } from "./price";

interface TokenImage {
  image: string;
  placeholder: string;
}

const TOKEN_IMAGES_TYPED: Record<string, TokenImage> = TOKEN_IMAGES as Record<
  string,
  TokenImage
>;

export default async function addTokenData(data: { positions: Position[] }) {
  const updatedPositions = await Promise.all(
    data.positions.map(async (position: Position) => {
      return {
        ...position,
        tokenIn: {
          ...position.tokenIn,
          img: TOKEN_IMAGES_TYPED[position.tokenIn.address]
            ? TOKEN_IMAGES_TYPED[position.tokenIn.address].image
            : "",
          blurImg: TOKEN_IMAGES_TYPED[position.tokenIn.address].placeholder
            ? TOKEN_IMAGES_TYPED[position.tokenIn.address].placeholder
            : "",
        },
        tokenOut: {
          ...position.tokenOut,
          img: TOKEN_IMAGES_TYPED[position.tokenOut.address]
            ? TOKEN_IMAGES_TYPED[position.tokenOut.address].image
            : "",
          blurImg: TOKEN_IMAGES_TYPED[position.tokenOut.address].placeholder
            ? TOKEN_IMAGES_TYPED[position.tokenOut.address].placeholder
            : "",
        },
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
