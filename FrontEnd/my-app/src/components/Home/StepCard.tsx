"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface StepCardProps {
  header?: boolean;
  stepNumber: string;
  title: string;
  description: string;
  imageSrc: string;
  left: boolean;
}

export default function StepCard({
  header,
  stepNumber,
  title,
  description,
  imageSrc,
  left,
}: StepCardProps) {
  const [viewed, setViewed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const checkPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if the Y position of the item is at the 50% Y position of the viewport
      if (
        rect.top <= viewportHeight * 0.5 &&
        rect.bottom >= viewportHeight * 0.5
      ) {
        setViewed(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkPosition);
    checkPosition(); // Initial check on load

    return () => {
      window.removeEventListener("scroll", checkPosition);
    };
  }, []);

  return (
    <div
      className="flex md:flex-row flex-col justify-around items-center md:mt-32 mt-16 font-inter"
      ref={cardRef}
    >
      <div
        className={`md:w-[20rem] md:h-[20rem] w-[90%] max-w-[20rem] aspect-square relative md:mt-0 mt-10 ${
          left
            ? "stepCardLeft md:order-first order-last"
            : "stepCardRight order-last"
        } ${viewed ? "stepCardFinished" : ""}`}
      >
        <Image src={imageSrc} alt={title} fill />
      </div>
      <div
        className={`text-white ${
          left
            ? `stepCardRight ${viewed && "stepCardFinished"}`
            : `stepCardLeft ${viewed && "stepCardFinished"}`
        } `}
      >
        {header && (
          <p className="font-juraBold md:text-3xl md:w-[20rem] text-xl w-[90%] text-center">
            Seamless Trading in Three Easy Steps
          </p>
        )}
        <div className="md:w-[20rem] w-[90%] mx-auto mt-10 card p-5 border-2 border-[#01FF39] rounded-2xl">
          <p className="md:text-sm text-xs text-[#01FF39] font-jura">
            {stepNumber}
          </p>
          <p className="md:text-xl text-lg font-interBold">{title}</p>
          <p className="text-white/80 md:text-sm text-xs mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
