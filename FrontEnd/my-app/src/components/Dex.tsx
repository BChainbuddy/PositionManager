"use client";

import Image from "next/image";
import { useForge } from "./ForgeContext";

interface DexProps {
  logo: string;
  name: string;
  address: string;
}

export default function Dex({ dex }: { dex: DexProps }) {
  const { setRouterAddress, routerAddress } = useForge();

  return (
    <div className="flex flex-col justify-center items-center w-[6rem] space-y-1">
      <div
        className={`relative h-12 w-12 rounded-2xl overflow-clip cursor-pointer ${
          routerAddress === dex.address && "border-4 border-[#ffe500]"
        }`}
        onClick={() => setRouterAddress(dex.address)}
      >
        <Image alt="dex logo" src={dex.logo} fill className="bg-white" />
      </div>
      <p className="text-xs">{dex.name}</p>
    </div>
  );
}
