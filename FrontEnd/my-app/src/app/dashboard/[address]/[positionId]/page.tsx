import Graph from "@/components/AddressPosition/Graph";
import PositionInfo from "@/components/AddressPosition/PositionInfo";
import GoBack from "@/ui/GoBack";

export default function PositionPage() {
  return (
    <div className="w-full h-[89vh] flex flex-row justify-evenly items-center">
      <Graph />
      <PositionInfo />
    </div>
  );
}
