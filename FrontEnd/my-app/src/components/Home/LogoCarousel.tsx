"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function LogoCarousel({ up }: { up: boolean }) {
  useEffect(() => {
    const scrollers = up
      ? document.querySelectorAll(".scrollerUp")
      : document.querySelectorAll(".scrollerDown");

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        // Cast `scroller` to `HTMLElement` to access `setAttribute`
        const element = scroller as HTMLElement;
        element.setAttribute("data-animated", "true");

        const selector = up ? ".carouselUp" : ".carouselDown";
        const scrollerInner = element.querySelector(selector) as HTMLElement;
        if (scrollerInner) {
          const scrollerContent = Array.from(scrollerInner.children);

          scrollerContent.forEach((item) => {
            // Cast `item` to `HTMLElement` to access `cloneNode` and `setAttribute`
            const elementItem = item as HTMLElement;
            const duplicatedItem = elementItem.cloneNode(true) as HTMLElement;
            duplicatedItem.setAttribute("aria-hidden", "true");
            scrollerInner.appendChild(duplicatedItem);
          });
        }
      });
    }
  }, []);
  return (
    <div
      className={`overflow-hidden max-h-[100vh] absolute ${
        up ? "top-0 left-[20%] scrollerUp" : "bottom-0 right-[20%] scrollerDown"
      }`}
    >
      <div
        className={`flex flex-col gap-[1rem] h-[200%] ${
          up ? "carouselUp" : "carouselDown"
        } `}
      >
        {[...Array(20)].map((_, i) => (
          <div className="w-[4.7rem] h-[4rem] relative">
            <Image
              key={i}
              src={`${
                [
                  "/BNB_zelen.png",
                  "/BTC_zelen_Big.png",
                  "/ETH_zelen.png",
                  "/SOL_zelen.png",
                ][i % 4]
              }`}
              fill
              alt={`Logo ${i}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
