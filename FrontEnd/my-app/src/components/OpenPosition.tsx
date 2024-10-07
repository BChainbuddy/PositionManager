import Image from "next/image";
import { Position } from "./OpenPositions";

interface OpenPositionProps {
  position: Position;
}

export default function OpenPosition({ position }: OpenPositionProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div>
        <div className="relative h-[2rem] w-[2rem]">
          <Image
            src={position.imgIn ? position.imgIn : ""}
            alt="Token logo"
            fill
          />
        </div>
        <div className="relative h-[2rem] w-[2rem]">
          <Image
            src={position.imgOut ? position.imgOut : ""}
            alt="Token logo"
            fill
          />
        </div>
      </div>
      <p>{position.symbolIn + "/" + position.symbolOut}</p>
      <p>Price: 0.001</p>
      <p>Target: 0.002</p>
      <p>End Date: 10 aug 2023</p>
    </div>
  );
}
