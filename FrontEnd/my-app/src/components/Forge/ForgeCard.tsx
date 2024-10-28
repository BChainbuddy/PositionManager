"use client";

import { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function ForgeCard() {
  const [step, setStep] = useState<number>(0);

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
    <div className="w-96 h-96 forgeCard flex justify-center items-center">
      <Step1 nextStep={nextStep} step={step} />
      <Step2 nextStep={nextStep} previousStep={previousStep} step={step} />
      <Step3 nextStep={nextStep} previousStep={previousStep} step={step} />
    </div>
  );
}
