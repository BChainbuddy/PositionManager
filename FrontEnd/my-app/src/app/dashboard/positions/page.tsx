import AllPosition from "@/components/AllPositions";

export default function Positions() {
  return (
    <div className="h-[89vh] flex flex-col">
      <div className="">
        <p className="font-juraBold text-2xl textShadow text-white">
          YOUR POSITIONS
        </p>
      </div>
      <AllPosition />
    </div>
  );
}
