"use client";

import Image from "next/image";
import { useState } from "react";

export default function InputSwitch() {
  const [animateSpin, setAnimateSpin] = useState<boolean>(false);

  const handleSpin = () => {
    setAnimateSpin(true);
    setTimeout(() => setAnimateSpin(false), 250);
  };
  return (
    <div className="h-6 w-6 relative mt-4 z-10" onClick={handleSpin}>
      <Image
        src="/Reverse.png"
        fill
        alt="Reverse icon"
        className={`${animateSpin && "spin"} cursor-pointer`}
      />
    </div>
  );
}
