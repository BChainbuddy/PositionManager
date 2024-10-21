"use client";

import Image from "next/image";

interface DexProps {
  logo: string;
  name: string;
  address: string;
}

export default function Dex({ dex }: { dex: DexProps }) {
  return (
    <div className="flex flex-col">
      <div>
        <Image alt="dex logo" src={dex.logo} fill />
      </div>
      <p>{dex.name}</p>
    </div>
  );
}
