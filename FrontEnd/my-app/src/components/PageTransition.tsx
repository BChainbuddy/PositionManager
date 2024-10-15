"use client";
import { usePageTransition } from "@/components/PageTransitionContext";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const { showTransition } = usePageTransition();

  const pathname = usePathname();

  return (
    <>
      <div
        className={`absolute top-[11vh] w-[100vw] ${
          pathname.includes("positions") ? "topShadowYellow" : "topShadow"
        } z-40 ${showTransition && "topTransition"}`}
      ></div>
      <div
        className={`absolute bottom-0 w-[100vw] ${
          pathname.includes("positions") ? "bottomShadowYellow" : "bottomShadow"
        } z-40 ${showTransition && "bottomTransition"}`}
      ></div>
    </>
  );
}
