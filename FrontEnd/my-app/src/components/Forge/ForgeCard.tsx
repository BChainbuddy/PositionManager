"use client";

import { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function ForgeCard() {
  const [step, setStep] = useState<number>(2);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    console.log(step);
  }, [step]);

  return (
    <div className="w-96 h-96 forgeCard">
      {step == 0 ? (
        <Step1 nextStep={nextStep} />
      ) : step == 1 ? (
        <Step2 nextStep={nextStep} previousStep={previousStep} />
      ) : step == 2 ? (
        <Step3 nextStep={nextStep} previousStep={previousStep} />
      ) : (
        <></>
      )}
    </div>
  );
}
