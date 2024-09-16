"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function LineScroll() {
  const [viewportCenter, setViewportCenter] = useState(0);
  const [initialY, setInitialY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && ref2.current && initialY && initialHeight) {
      const middleDistance = window.scrollY + window.innerHeight / 2;

      // If the middle of the viewport reaches the top of the element (initialY)
      if (middleDistance >= initialY) {
        // Calculate the amount of height to decrease based on the scroll position
        const newHeight = Math.max(
          initialHeight - (middleDistance - initialY),
          0 // Ensure the height doesn't go below 0
        );

        // New Height
        ref2.current.style.height = `${newHeight}px`;

        console.log(`This is the new height: ${newHeight}px`);
      }
    }
  }, [viewportCenter, initialY, initialHeight]);

  const handleScroll = () => {
    const centerY = window.scrollY + window.innerHeight / 2;
    setViewportCenter(centerY);
  };

  useEffect(() => {
    if (ref.current && ref2.current) {
      const rect = ref.current?.getBoundingClientRect();
      setInitialY(rect.top + window.scrollY); // Get the initial Y position of the element relative to the document
      setInitialHeight(ref2.current.offsetHeight); // Get the initial height of the element
      console.log("INITIAL DISTANCE", rect.y);
      console.log("INITIAL HEIGHT", ref2.current.offsetHeight);
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref, ref2]);

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-[10rem] bottom-[10rem] w-[100px]">
      <div className="relative h-full w-[2rem] z-10" ref={ref}>
        <Image src="/UnionLine.png" alt="Line" fill className="z-10" />
        <div
          className="absolute bg-[#041516] h-[98%] z-20 w-[5rem] bottom-0"
          ref={ref2}
        ></div>
      </div>
    </div>
  );
}
