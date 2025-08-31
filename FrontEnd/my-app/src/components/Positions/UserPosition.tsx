import { Position } from "../Dashboard/OpenPositions";
import LogoWrapper from "../../ui/LogoWrapper";
import formatNumber from "@/lib/formatNumber";
import Link from "next/link";
import getDate from "@/lib/getDate";

interface OpenPositionProps {
  position: Position;
}

export default function UserPosition({ position }: OpenPositionProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-xl overflow-hidden bg-white md:w-[7rem] w-[5.5rem] font-juraBold">
      <div className="relative md:h-[4rem] h-[3rem] w-full bg-[#FFE500] flex flex-row items-center justify-center">
        <div className="absolute -translate-x-3 rounded-full overflow-hidden z-10">
          <div className="relative md:h-[2.7rem] md:w-[2.7rem] h-[1.8rem] w-[1.8rem]">
            <LogoWrapper
              src={position.tokenIn.img}
              blurImg={position.tokenIn.blurImg}
              alt="Token logo"
            />
          </div>
        </div>
        <div className="absolute translate-x-1.5 rounded-full overflow-hidden z-20">
          <div className="relative md:h-[2.7rem] md:w-[2.7rem] h-[1.8rem] w-[1.8rem]">
            <LogoWrapper
              src={position.tokenOut.img}
              blurImg={position.tokenOut.img}
              alt="Token logo"
            />
          </div>
        </div>
      </div>
      <div className="py-2 flex flex-col space-y-[0.1rem] w-full px-0.5">
        <p className="md:text-[0.8rem] text-[0.7rem]">
          {position.tokenIn.symbol + "/" + position.tokenOut.symbol}
        </p>
        <p className="md:text-[0.7rem] text-[0.6rem] w-full overflow-hidden">
          Price: {position.price ? formatNumber(position.price) : "0"}
        </p>
        <p className="md:text-[0.7rem] text-[0.6rem]">
          Target: {formatNumber(position.executionValue / 10 ** 18)}
        </p>
        <p className="md:text-[0.7rem] text-[0.6rem]">
          {getDate(position.endTimestamp)}
        </p>
        <Link
          className="bg-[#FFE500] rounded-2xl text-center px-0.5 md:text-[0.7rem] text-[0.6rem] w-[90%] mx-auto cursor-pointer"
          href={`/app/positions/${position.wallet}/${position.id}`}
        >
          More info
        </Link>
      </div>
    </div>
  );
}
