"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function LogoCarousel({ up }: { up?: boolean }) {
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
        up
          ? "md:top-0 md:left-[20%] left-0 top-[10%] scrollerUp"
          : "md:bottom-0 md:right-[20%] right-0 bottom-[10%] scrollerDown"
      }`}
    >
      <div
        className={`flex md:flex-col flex-row gap-[1rem] md:h-[200%] md:w-fit w-[200%] h-[100%] ${
          up ? "carouselUp" : "carouselDown"
        }`}
      >
        {[...Array(20)].map((_, i) => (
          <div
            className="relative md:h-16 md:w-auto h-auto w-8 flex items-center justify-center"
            key={i}
          >
            <Image
              src={`${
                [
                  "/tokenImages/binance-logo.svg",
                  "/tokenImages/bitcoin-logo.svg",
                  "/tokenImages/ethereum-logo2.png",
                  "/tokenImages/solana-logo.svg",
                ][i % 4]
              }`}
              alt={`Logo ${i}`}
              width={128}
              height={64}
              className="md:h-16 md:w-auto w-8 h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
