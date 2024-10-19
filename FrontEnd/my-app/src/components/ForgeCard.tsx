"use client";

import { useState } from "react";
import Step1 from "./Step1";

export default function ForgeCard() {
  const [step, setStep] = useState<number>(0);

  return (
    <div className="w-96 h-96 bg-[#002114] forgeCard">
      {step == 0 ? <Step1 /> : <></>}
    </div>
  );
}
