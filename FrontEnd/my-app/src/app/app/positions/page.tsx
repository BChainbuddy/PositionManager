import AllPosition from "@/components/Positions/AllPositions";
import GoBack from "@/ui/GoBack";

export default function Positions() {
  return (
    <div className="h-[89vh] flex flex-col w-[65rem] mx-auto">
      <div className="flex flex-row space-x-10 items-center mt-10">
        <GoBack />
        <p className="font-juraBold text-2xl textShadow text-white ml-10">
          YOUR POSITIONS
        </p>
      </div>
      <AllPosition />
    </div>
  );
}
