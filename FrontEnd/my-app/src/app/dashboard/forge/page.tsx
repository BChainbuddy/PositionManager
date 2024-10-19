import ForgeCard from "@/components/ForgeCard";
import { ForgeContextProvider } from "@/components/ForgeContext";

export default function Forge() {
  return (
    <ForgeContextProvider>
      <div className="flex h-[89vh] w-full justify-center items-center">
        <ForgeCard />
      </div>
    </ForgeContextProvider>
  );
}
