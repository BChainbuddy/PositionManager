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
      <div className="relative md:w-[5rem] md:h-[5rem] h-12 w-12">
        <Image
          src={src}
          alt={alt}
          fill
          style={{ animationDelay: delay }}
          className={`${inView && "iconImageFinished"}`}
        />
      </div>
      <div className="font-juraBold text-white md:w-[10rem] w-[7rem] text-center md:text-base text-sm">
        {text}
      </div>
    </div>
  );
}
