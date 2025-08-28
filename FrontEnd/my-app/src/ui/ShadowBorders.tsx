"use client";

import { usePathname } from "next/navigation";

export default function ShadowBorders() {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`hidden md:block absolute top-[11vh] w-[100vw] ${
          pathname.includes("positions") ? "topShadowYellow" : "topShadow"
        } z-40`}
      ></div>
      <div
        className={`hidden md:block absolute bottom-0 w-[100vw] ${
          pathname.includes("positions") ? "bottomShadowYellow" : "bottomShadow"
        } z-40`}
      ></div>
    </>
  );
}
