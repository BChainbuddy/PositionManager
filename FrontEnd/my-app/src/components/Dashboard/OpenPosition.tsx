import LogoWrapper from "../../ui/LogoWrapper";
import { Position } from "./OpenPositions";

interface OpenPositionProps {
  position: Position;
}

export default function OpenPosition({ position }: OpenPositionProps) {
  const getDate = () => {
    const myDate = new Date(position.endTimestamp * 1000);
    return myDate.toDateString();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center rounded-xl overflow-hidden bg-white w-[6.5rem]">
      <div className="relative h-[3.3rem] w-full bg-[#FFE500] flex flex-row items-center justify-center">
        <div className="absolute -translate-x-3 rounded-full overflow-hidden z-10">
          <div className="relative h-[2.3rem] w-[2.3rem]">
            <LogoWrapper
              src={position.imgIn ? position.imgIn : "/unknownToken.png"}
              alt="Token logo"
            />
          </div>
        </div>
        <div className="absolute translate-x-3 rounded-full overflow-hidden z-20">
          <div className="relative h-[2.3rem] w-[2.3rem]">
            <LogoWrapper
              src={position.imgOut ? position.imgOut : "/unknownToken.png"}
              alt="Token logo"
            />
          </div>
        </div>
      </div>
      <div className="py-1 flex flex-col">
        <p className="text-[0.7rem]">
          {position.symbolIn + "/" + position.symbolOut}
        </p>
        <p className="text-[0.6rem]">
          Price:{" "}
          {position.price ? position.price.toString().substring(0, 7) : "0"}
        </p>

        <p className="text-[0.6rem]">
          Target:{" "}
          {(position.executionValue / 10 ** 18).toString().substring(0, 7)}
        </p>
        <p className="text-[0.6rem]">{getDate()}</p>
      </div>
    </div>
  );
}
