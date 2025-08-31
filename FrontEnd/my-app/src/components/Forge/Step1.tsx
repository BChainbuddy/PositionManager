import { useForge } from "@/context/ForgeContext";
import InputSwitch from "./InputSwitch";
import InputToken from "./InputToken";

interface Step1Props {
  nextStep: () => void;
  step: number;
}

export default function Step1({ nextStep, step }: Step1Props) {
  const { outputToken, inputToken } = useForge();

  return (
    <div
      className={`h-full w-full flex flex-col text-white justify-center items-center font-juraBold transition-all duration-1000 absolute mx-auto ${
        step > 0
          ? "duration-500 opacity-0 z-10"
          : step === 0
          ? "opacity-100 z-20 delay-500"
          : "opacity-0 translate-x-10 z-10"
      }`}
    >
      <p className="text-center text-[#01FF39] md:text-2xl text-lg">
        CREATE YOUR POSITION
      </p>
      <div className="flex flex-row items-center md:space-x-2 space-x-1 self-end md:mr-10 mr-[10vw] mt-6 md:text-lg text-sm">
        <p>INPUT TOKEN:</p>
        <InputToken input={true} />
      </div>
      <InputSwitch />
      <div className="flex flex-row items-center md:space-x-2 space-x-1 mt-4 self-end md:mr-10 mr-[10vw] md:text-lg text-sm">
        <p>OUTPUT TOKEN:</p>
        <InputToken input={false} />
      </div>
      <button
        className="flex items-center justify-center h-8 w-24 bg-[#01FF39] rounded-2xl text-black mt-6 md:text-base text-sm"
        onClick={nextStep}
        disabled={!outputToken || !inputToken}
      >
        CONTINUE
      </button>
    </div>
  );
}
