import formatNumber from "@/lib/formatNumber";
import LogoWrapper from "../../ui/LogoWrapper";
import { Position } from "./OpenPositions";
import getDate from "@/lib/getDate";

interface OpenPositionProps {
  position: Position;
}

export default function OpenPosition({ position }: OpenPositionProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-xl overflow-hidden bg-white w-[6.5rem]">
      <div className="relative h-[3.3rem] w-full bg-[#FFE500] flex flex-row items-center justify-center">
        <div className="absolute -translate-x-3 rounded-full overflow-hidden z-10">
          <div className="relative h-[2.3rem] w-[2.3rem]">
            <LogoWrapper
              src={position.tokenIn.img}
              blurImg={position.tokenIn.blurImg}
              alt="Token logo"
            />
          </div>
        </div>
        <div className="absolute translate-x-3 rounded-full overflow-hidden z-20">
          <div className="relative h-[2.3rem] w-[2.3rem]">
            <LogoWrapper
              src={position.tokenOut.img}
              blurImg={position.tokenOut.blurImg}
              alt="Token logo"
            />
          </div>
        </div>
      </div>
      <div className="py-1 flex flex-col">
        <p className="text-[0.7rem]">
          {position.tokenIn.symbol + "/" + position.tokenOut.symbol}
        </p>
        <p className="text-[0.6rem]">
          Price: {position.price ? formatNumber(position.price) : "0"}
        </p>

        <p className="text-[0.6rem]">
          Target: {formatNumber(position.executionValue / 10 ** 18)}
        </p>
        <p className="text-[0.6rem]">{getDate(position.endTimestamp)}</p>
      </div>
    </div>
  );
}
