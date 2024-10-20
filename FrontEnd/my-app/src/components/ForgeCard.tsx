"use client";

import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";

export default function ForgeCard() {
  const [step, setStep] = useState<number>(1);

  return (
    <div className="w-96 h-96 forgeCard">
      {step == 0 ? <Step1 /> : 1 ? <Step2 /> : <></>}
    </div>
  );
}
