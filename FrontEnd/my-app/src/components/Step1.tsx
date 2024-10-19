import InputSwitch from "./InputSwitch";
import InputToken from "./InputToken";

export default function Step1() {
  return (
    <div className="h-full w-full flex flex-col text-white justify-center items-center font-juraBold">
      <p className="text-center text-[#01FF39] text-xl">CREATE YOUR POSITION</p>
      <div className="flex flex-row items-center space-x-2 self-end mr-12 mt-6 text-lg">
        <p>INPUT TOKEN:</p>
        <InputToken input={true} />
      </div>
      <InputSwitch />
      <div className="flex flex-row items-center space-x-2 mt-4 self-end mr-12 text-lg">
        <p>OUTPUT TOKEN:</p>
        <InputToken input={false} />
      </div>
      <button className="flex items-center justify-center h-8 w-24 bg-[#01FF39] rounded-2xl text-black mt-6">
        CONTINUE
      </button>
    </div>
  );
}
