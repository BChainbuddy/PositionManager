"use client";

import Image from "next/image";
import { useInView } from "react-intersection-observer";

interface IconTextProps {
  src: string;
  text: string;
  alt: string;
  delay: string;
}

export default function IconText({ src, text, alt, delay }: IconTextProps) {
  const { ref, inView, entry } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <div
      style={{ animationDelay: delay }}
      className={`flex flex-col justify-center items-center space-y-4 iconText ${delay} ${
        inView && "iconTextFinished"
      }`}
      ref={ref}
    >
      <Image
        src={src}
        alt={alt}
        height={100}
        width={100}
        style={{ animationDelay: delay }}
        className={`${inView && "iconImageFinished"}`}
      />
      <div className="font-juraBold text-white w-[10rem] text-center">
        {text}
      </div>
    </div>
  );
}