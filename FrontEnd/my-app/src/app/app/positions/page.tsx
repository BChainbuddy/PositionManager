import AllPosition from "@/components/Positions/AllPositions";
import GoBack from "@/ui/GoBack";

export default function Positions() {
  return (
    <div className="md:h-[89vh] flex flex-col md:w-[65rem] w-[95vw] mx-auto">
      <div className="flex flex-row space-x-10 items-center mt-10">
        <GoBack />
        <p className="font-juraBold md:text-2xl text-lg textShadow text-white md:ml-10 ml-5">
          YOUR POSITIONS
        </p>
      </div>
      <AllPosition />
    </div>
  );
}
