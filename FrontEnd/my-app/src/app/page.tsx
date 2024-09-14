import Image from "next/image";
import { jura } from "./fonts/Jura";
import LogoCorousel from "@/components/LogoCorousel";

export default function Home() {
  return (
    <>
      <div className="relative h-[100vh] w-[100vw] overflow-x-hidden flex justify-center items-center">
        <div className="absolute -left-[60px] h-[100vh] w-[60px] shadow-[0_0_3rem_2rem_#01FF39]"></div>
        <div className="absolute right-[-60px] h-[100vh] w-[60px] shadow-[0_0_3rem_2rem_#01FF39]"></div>
        <div className="text-center text-white">
          <p
            className={`${jura.className} text-5xl text-[#01FF39] tracking-[0.6rem] mb-6`}
          >
            TRADE FORGE
          </p>
          <p>Make trading on blockchain great again.</p>
          <p className="mt-1">
            Start being the owner of your time and stop looking at
          </p>
          <p className="mt-1">charts, keep that to the computers.</p>
          <button
            className={`${jura.className} font-black bg-[#01FF39] mt-10 text-black w-52 h-10 rounded-2xl text-xl`}
          >
            START TRADING
          </button>
        </div>
        <LogoCorousel up={false} />
        <LogoCorousel up={true} />
      </div>
    </>
  );
}
