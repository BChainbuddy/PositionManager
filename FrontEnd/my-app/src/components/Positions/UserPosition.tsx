import { Position } from "../Dashboard/OpenPositions";
import LogoWrapper from "../../ui/LogoWrapper";

interface OpenPositionProps {
  position: Position;
}

export default function UserPosition({ position }: OpenPositionProps) {
  const getDate = () => {
    const myDate = new Date(position.endTimestamp * 1000);
    return myDate.toDateString();
  };

  // console.log(position);
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
      <div className="py-2 flex flex-col space-y-[0.1rem]">
        <p className="text-[0.8rem]">
          {position.symbolIn + "/" + position.symbolOut}
        </p>
        <p className="text-[0.7rem]">
          Price:{" "}
          {position.price ? position.price.toString().substring(0, 7) : "0"}
        </p>

        <p className="text-[0.7rem]">
          Target:{" "}
          {(position.executionValue / 10 ** 18).toString().substring(0, 7)}
        </p>
        <p className="text-[0.7rem]">{getDate()}</p>
        <button className="bg-[#FFE500] rounded-2xl text-center px-0.5 text-[0.7rem]">
          Add duration
        </button>
      </div>
    </div>
  );
}
