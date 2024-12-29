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
    <div className="flex flex-col items-center justify-center text-center rounded-xl overflow-hidden bg-white w-[7rem] font-juraBold">
      <div className="relative h-[4rem] w-full bg-[#FFE500] flex flex-row items-center justify-center">
        <div className="absolute -translate-x-3 rounded-full overflow-hidden z-10">
          <div className="relative h-[2.7rem] w-[2.7rem]">
            <LogoWrapper
              src={position.imgIn ? position.imgIn : "/unknownToken.png"}
              alt="Token logo"
            />
          </div>
        </div>
        <div className="absolute translate-x-3 rounded-full overflow-hidden z-20">
          <div className="relative h-[2.7rem] w-[2.7rem]">
            <LogoWrapper
              src={position.imgOut ? position.imgOut : "/unknownToken.png"}
              alt="Token logo"
            />
          </div>
        </div>
      </div>
      <div className="py-2 flex flex-col space-y-[0.1rem] w-full px-0.5">
        <p className="text-[0.8rem]">
          {position.tokenIn.symbol + "/" + position.tokenOut.symbol}
        </p>
        <p className="text-[0.7rem] w-full overflow-hidden">
          Price: {position.price ? formatNumber(position.price) : "0"}
        </p>

        <p className="text-[0.7rem]">
          Target: {formatNumber(position.executionValue / 10 ** 18)}
        </p>
        <p className="text-[0.7rem]">{getDate(position.endTimestamp)}</p>
        <Link
          className="bg-[#FFE500] rounded-2xl text-center px-0.5 text-[0.7rem] w-[90%] mx-auto cursor-pointer"
          href={`/dashboard/${position.wallet}/${position.id}`}
        >
          More info
        </Link>
      </div>
    </div>
  );
}
