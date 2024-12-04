import Chart from "@/components/AddressPosition/Chart";
import PositionInfo from "@/components/AddressPosition/PositionInfo";
import GoBack from "@/ui/GoBack";

export default function PositionPage() {
  const mockPosition = {};
  
  return (
    <div className="w-full h-[89vh] flex flex-row justify-evenly items-center">
      <Chart />
      <PositionInfo />
    </div>
  );
}
