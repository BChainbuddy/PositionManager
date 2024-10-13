"use client";
import { usePageTransition } from "@/components/PageTransitionContext";

export default function PageTransition() {
  const { showTransition } = usePageTransition();

  return (
    <>
      <div
        className={`absolute top-[11vh] w-[100vw] topShadow z-40 ${
          showTransition && "topTransition"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 w-[100vw] bottomShadow z-40 ${
          showTransition && "bottomTransition"
        }`}
      ></div>
    </>
  );
}
