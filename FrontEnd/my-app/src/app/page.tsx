import Image from "next/image";
import LogoCarousel from "@/components/LogoCarousel";
import StepCard from "@/components/StepCard";
import ShadowBars from "@/components/ShadowBars";
import LineScroll from "@/components/LineScroll";

export default function Home() {
  return (
    <>
      <ShadowBars />
      <div className="relative h-[100vh] w-[100vw] overflow-x-hidden flex justify-center items-center">
        <div className="text-center text-white font-inter header">
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
      <div className="mt-24 relative">
        {/* <div className="absolute left-1/2 transform -translate-x-1/2 top-[10rem] bottom-[10rem] w-[100px]">
          <div className="relative h-full w-[2rem]">
            <Image src="/UnionLine.png" alt="Line" fill />
          </div>
        </div> */}
        <LineScroll />
        <StepCard
          header={true}
          left={true}
          stepNumber="Step 1"
          title="Create Your Position"
          description="Easily initiate your trade by selecting the tokens you'd like to swap, defining the quantity, and choosing your preferred decentralized exchange. Specify your trading goals, such as swap price and duration, and Trade Forge will handle the rest."
          imageSrc="/Step1Border.png"
        />
        <StepCard
          left={false}
          stepNumber="Step 2"
          title="Monitor & Optimize"
          description="Once you've forged your position, Trade Forge continuously monitors the market for your set swap price. You can check the progress at any time."
          imageSrc="/Step2Border.png"
        />
        <StepCard
          left={true}
          stepNumber="Step 3"
          title="Automatic Execution & Rewards"
          description="Once your specified conditions are met, Trade Forge automatically executes the swap on your behalf."
          imageSrc="/Step3Border.png"
        />
      </div>
    </>
  );
}
