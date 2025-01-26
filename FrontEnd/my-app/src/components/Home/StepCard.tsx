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
      className="flex flex-row justify-around items-center mt-32 font-inter"
      ref={cardRef}
    >
      {left && (
        <div
          className={`w-[20rem] h-[20rem] relative stepCardLeft ${
            viewed ? "stepCardFinished" : ""
          }`}
        >
          <Image src={imageSrc} alt={title} fill />
        </div>
      )}
      <div
        className={`text-white ${
          left
            ? `stepCardRight ${viewed && "stepCardFinished"}`
            : `stepCardLeft ${viewed && "stepCardFinished"}`
        } `}
      >
        {header && (
          <p className="font-juraBold text-3xl w-[20rem] text-center">
            Seamless Trading in Three Easy Steps
          </p>
        )}
        <div className="w-[20rem] mt-10 card p-5 border-2 border-[#01FF39] rounded-2xl">
          <p className="text-sm text-[#01FF39] font-jura">{stepNumber}</p>
          <p className="text-xl font-interBold">{title}</p>
          <p className="text-white/80 text-sm mt-1">{description}</p>
        </div>
      </div>
      {!left && (
        <div
          className={`w-[20rem] h-[20rem] relative stepCardRight ${
            viewed ? "stepCardFinished" : ""
          }`}
        >
          <Image src={imageSrc} alt={title} fill />
        </div>
      )}
    </div>
  );
}
