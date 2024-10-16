"use client";

import { useState } from "react";

export default function ForgeCard() {
  const [step, setStep] = useState<Number>(0);

  return <div className="w-96 h-96 bg-[#002114] forgeCard"></div>;
}
