import Chart from "@/components/AddressPosition/Chart";
import PositionInfo from "@/components/AddressPosition/PositionInfo";

export default function PositionPage() {
  return (
    <div className="w-full md:h-[89vh] flex md:flex-row flex-col-reverse justify-evenly items-center mt-8 md:mt-0 gap-y-8 md:gap-y-0">
      <Chart />
      <PositionInfo />
    </div>
  );
}
