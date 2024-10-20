"use client";

import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";

export default function ForgeCard() {
  const [step, setStep] = useState<number>(0);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="w-96 h-96 forgeCard">
      {step == 0 ? (
        <Step1 nextStep={nextStep} />
      ) : 1 ? (
        <Step2 nextStep={nextStep} previousStep={previousStep} />
      ) : (
        <></>
      )}
    </div>
  );
}
