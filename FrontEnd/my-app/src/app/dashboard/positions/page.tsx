import AllPosition from "@/components/AllPositions";

export default function Positions() {
  return (
    <div className="h-[89vh] flex flex-col w-[65rem] mx-auto">
      <p className="font-juraBold text-2xl textShadow text-white pl-10 mt-12">
        YOUR POSITIONS
      </p>
      <AllPosition />
    </div>
  );
}
