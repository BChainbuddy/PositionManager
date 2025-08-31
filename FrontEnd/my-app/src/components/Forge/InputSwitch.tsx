"use client";

import Image from "next/image";
import { useState } from "react";
import { useForge } from "../../context/ForgeContext";

export default function InputSwitch() {
  const [animateSpin, setAnimateSpin] = useState<boolean>(false);

  const handleSpin = () => {
    setAnimateSpin(true);
    let holder = inputToken;
    setInputToken(outputToken);
    setOutputToken(holder);
    setTimeout(() => setAnimateSpin(false), 250);
  };

  const { outputToken, inputToken, setInputToken, setOutputToken } = useForge();

  return (
    <div
      className="md:h-6 md:w-6 h-5 w-5 relative mt-4 z-10"
      onClick={handleSpin}
    >
      <Image
        src="/Reverse.png"
        fill
        alt="Reverse icon"
        className={`${animateSpin && "spin"} cursor-pointer`}
      />
    </div>
  );
}
