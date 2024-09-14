import Image from "next/image";
import LogoCarousel from "@/components/LogoCarousel";

export default function Home() {
  return (
    <>
      <div className="relative h-[100vh] w-[100vw] overflow-x-hidden flex justify-center items-center">
        <div className="absolute -left-[60px] h-[100vh] w-[60px] shadow-[0_0_2rem_2rem_#01FF39]"></div>
        <div className="absolute right-[-60px] h-[100vh] w-[60px] shadow-[0_0_2rem_2rem_#01FF39]"></div>
        <div className="text-center text-white font-inter">
          <p className="text-5xl text-[#01FF39] tracking-[0.6rem] mb-6 font-juraBold">
            TRADE FORGE
          </p>
          <p>Make trading on blockchain great again.</p>
          <p className="mt-2">
            Start being the owner of your time and stop looking at
          </p>
          <p className="mt-2">charts, keep that to the computers.</p>
          <button className="text-black bg-[#01FF39] mt-10 w-52 h-10 rounded-2xl text-xl font-juraBold">
            START TRADING
          </button>
        </div>
        <LogoCarousel up={false} />
        <LogoCarousel up={true} />
        <div className="text-white text-center absolute bottom-[5%] text-sm scrollDownText">
          <p>Scroll Down</p>
          <p>V</p>
        </div>
      </div>
      <div className="flex flex-col mt-32">
        <p className="text-4xl text-center bg-gradient-to-r from-[#01FF39] to-[#FFE500] bg-clip-text text-transparent font-juraBold">
          Unlock the Power of Decentralized Trading
        </p>
        <div className="flex flex-row bg-gradient-to-br from-[#01FF39] to-[#FFE500] justify-evenly items-center py-10 mt-10">
          <div className="text-black">
            <p className="w-[30rem] text-xl">
              <span className="font-interBold">Trade Forge</span> is a
              cutting-edge decentralized application (dApp) designed to{" "}
              <span className="font-interBold">streamline</span> and{" "}
              <span className="font-interBold">optimize</span> your{" "}
              <span className="font-interBold">trading experience</span> on
              Uniswap V2 and V3 forks.
            </p>
            <p className="w-[30rem] text-xl mt-8">
              With Trade Forge, you can{" "}
              <span className="font-interBold">easily create</span>, manage, and{" "}
              <span className="font-interBold">automate</span> custom trading
              positions on decentralized exchanges. Our platform offers dynamic
              fee management,{" "}
              <span className="font-interBold">real-time monitoring</span>, and{" "}
              <span className="font-interBold">seamless token swapping</span> to
              help you stay <span className="font-interBold">in control</span>{" "}
              while automating the heavy lifting.
            </p>
          </div>
          <Image
            src="/TradeForge.webp"
            alt="Trade Forge"
            height={600}
            width={600}
          />
        </div>
      </div>
    </>
  );
}
