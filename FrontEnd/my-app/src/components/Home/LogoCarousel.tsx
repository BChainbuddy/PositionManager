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
          <div
            className="relative h-16 flex items-center justify-center"
            key={i}
          >
            <Image
              src={`${
                [
                  "/tokenImages/binance-logo.svg",
                  "/tokenImages/bitcoin-logo.svg",
                  "/tokenImages/ethereum-logo.png",
                  "/tokenImages/solana-logo.svg",
                ][i % 4]
              }`}
              alt={`Logo ${i}`}
              width={128}
              height={64}
              className="h-16 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
