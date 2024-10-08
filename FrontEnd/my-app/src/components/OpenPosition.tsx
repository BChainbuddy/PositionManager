import Image from "next/image";
import { Position } from "./OpenPositions";

interface OpenPositionProps {
  position: Position;
}

export default function OpenPosition({ position }: OpenPositionProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-xl overflow-hidden bg-white w-[7rem]">
      <div className="relative h-[3.5rem] w-full bg-[#FFE500] flex flex-row items-center justify-center">
        <div className="absolute translate-x-3 rounded-full overflow-hidden z-20">
          <div className="relative h-[2.4rem] w-[2.4rem]">
            <Image
              src={position.imgIn ? position.imgIn : "/unknownToken.png"}
              alt="Token logo"
              fill
              className="bg-white"
              quality={100}
            />
          </div>
        </div>
        <div className="absolute -translate-x-3 rounded-full overflow-hidden z-10">
          <div className="relative h-[2.4rem] w-[2.4rem]">
            <Image
              src={position.imgOut ? position.imgOut : "/unknownToken.png"}
              alt="Token logo"
              fill
              className="bg-white"
              quality={100}
            />
          </div>
        </div>
      </div>
      <div className="py-2 flex flex-col space-y-0.5">
        <p className="text-xs">
          {position.symbolIn + "/" + position.symbolOut}
        </p>
        <p className="text-xs">Price: 0.001</p>
        <p className="text-xs">Target: 0.002</p>
        <p className="text-xs">10 aug 2023</p>
      </div>
    </div>
  );
}
