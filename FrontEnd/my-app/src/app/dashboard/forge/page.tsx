import ForgeCard from "@/components/Forge/ForgeCard";
import { ForgeContextProvider } from "@/context/ForgeContext";

export default function Forge() {
  return (
    <ForgeContextProvider>
      <div className="flex h-[89vh] w-full justify-center items-center">
        <ForgeCard />
      </div>
    </ForgeContextProvider>
  );
}
