import InputToken from "./InputToken";

interface Step1Props {
  setTokenIn: any;
  setTokenOut: any;
}

export default function Step1({ setTokenIn, setTokenOut }: Step1Props) {
  return (
    <div className="h-full w-full flex flex-col text-white justify-center items-center">
      <p className="text-center">CREATE YOUR POSITION</p>
      <div className="flex flex-row self-end">
        <p>INPUT TOKEN:</p>
        <InputToken />
      </div>
      <div className="flex flex-row self-end">
        <p>OUTPUT TOKEN:</p>
        <InputToken />
      </div>
    </div>
  );
}
