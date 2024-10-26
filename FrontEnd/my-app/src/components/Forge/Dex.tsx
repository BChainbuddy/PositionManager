"use client";

import Image from "next/image";
import { useForge } from "../../context/ForgeContext";

interface DexProps {
  logo: string;
  name: string;
  address: string;
}

export default function Dex({
  dexInfo,
  automatic,
}: {
  dexInfo: DexProps;
  automatic: boolean;
}) {
  const { dex, setDex } = useForge();

  return (
    <div className="flex flex-col justify-center items-center w-[6rem] space-y-1">
      <div
        className={`relative h-12 w-12 rounded-2xl overflow-clip cursor-pointer ${
          dex?.address === dexInfo?.address &&
          !automatic &&
          "border-4 border-[#ffe500]"
        }`}
        onClick={() => setDex(dexInfo)}
      >
        <Image alt="dex logo" src={dexInfo.logo} fill className="bg-white" />
      </div>
      <p className="text-xs">{dexInfo.name}</p>
    </div>
  );
}
