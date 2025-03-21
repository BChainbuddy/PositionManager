import Image from "next/image";
import LogoCarousel from "@/components/Home/LogoCarousel";
import StepCard from "@/components/Home/StepCard";
import ShadowBars from "@/components/Home/ShadowBars";
import LineScroll from "@/components/Home/LineScroll";
import IconText from "@/components/Home/IconText";
import Footer from "@/components/Home/Footer";
// import Background from "@/components/Home/Background";
import Button from "@/ui/Button";

export default function Home() {
  return (
    <>
      {/* <Background /> */}
      <div className="relative z-20">
        <ShadowBars />
        <div className="relative h-[100vh] w-[100vw] overflow-x-hidden flex justify-center items-center">
          <div className="text-center text-white font-inter title flex flex-col items-center justify-center">
            <p className="md:text-5xl text-2xl text-[#01FF39] tracking-[0.6rem] mb-6 font-juraBold">
              <span className="trade">TRADE </span>
              <span className="forge">FORGE</span>
            </p>
            <p className="md:text-sm text-xs text-[#d5d2d2]">
              Make trading on{" "}
              <span className="md:text-base text-sm text-[#01FF39] font-juraBold">
                BLOCKCHAIN
              </span>{" "}
              great again.
            </p>
            <p className="mt-2 md:text-sm text-xs text-[#d5d2d2]">
              Start being the owner of{" "}
              <span className="md:text-base text-sm text-[#01FF39] font-juraBold">
                YOUR TIME
              </span>{" "}
              and stop looking at
            </p>
            <p className="mt-2 md:text-sm text-xs text-[#d5d2d2]">
              charts, keep that to the{" "}
              <span className="md:text-base text-sm text-[#01FF39] font-juraBold">
                COMPUTERS
              </span>
              .
            </p>
            <Button
              className="md:mt-10 mt-6 md:w-52 w-40 md:h-10 h-8 rounded-2xl md:text-xl text-base"
              title="START TRADING"
              href="/app/dashboard"
            />
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
            <div className="text-[#041516]">
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
                <span className="font-interBold">easily create</span>, manage,
                and <span className="font-interBold">automate</span> custom
                trading positions on decentralized exchanges. Our platform
                offers dynamic fee management,{" "}
                <span className="font-interBold">real-time monitoring</span>,
                and{" "}
                <span className="font-interBold">seamless token swapping</span>{" "}
                to help you stay{" "}
                <span className="font-interBold">in control</span> while
                automating the heavy lifting.
              </p>
            </div>
            <div className="relative h-[25rem] w-[25rem] rounded-md overflow-hidden">
              <Image src="/TradeForge.webp" alt="Trade Forge" fill />
            </div>
          </div>
        </div>
        <div className="mt-24 relative">
          <LineScroll />
          <StepCard
            header={true}
            left={false}
            stepNumber="Step 1"
            title="Create Your Position"
            description="Easily initiate your trade by selecting the tokens you'd like to swap, defining the quantity, and choosing your preferred decentralized exchange. Specify your trading goals, such as swap price and duration, and Trade Forge will handle the rest."
            imageSrc="/Step1Border.png"
          />
          <StepCard
            left={true}
            stepNumber="Step 2"
            title="Monitor & Optimize"
            description="Once you've forged your position, Trade Forge continuously monitors the market for your set swap price. You can check the progress at any time. If your position needs more time to reach the target price, you can easily extend the duration and let Trade Forge continue tracking and optimizing your trade on your behalf."
            imageSrc="/Step2Border.png"
          />
          <StepCard
            left={false}
            stepNumber="Step 3"
            title="Automatic Execution & Rewards"
            description="Once your specified conditions are met, Trade Forge automatically executes the swap on your behalf. The swapped tokens and any rewards are automatically sent to your wallet, making the entire process seamless and effortless."
            imageSrc="/Step3Border.png"
          />
        </div>
        <div className="mt-52">
          <div className="flex flex-col text-center font-juraBold">
            <p className="text-4xl font-jura text-white">Why Trade Forge?</p>
            <p className="text-xl text-[#01FF39]">Trade Smarter, Not Harder</p>
          </div>
          <div className="flex flex-row space-x-32 justify-center mt-24">
            <IconText
              src="/TradeIconWhite.png"
              alt="Trade Icon"
              text="Customizable Positions"
              delay="0s"
            />
            <IconText
              src="/AutomationIcon.png"
              alt="Automation Icon"
              text="Seamless Automation"
              delay="0.5s"
            />
            <IconText
              src="/SecureIcon.png"
              alt="Secure icon"
              text="Decentralized & Secure"
              delay="1s"
            />
          </div>
        </div>
        <div className="mt-52 flex flex-col justify-center items-center space-y-5">
          <p className="text-center font-juraBold text-white text-2xl">
            LIKE WHAT YOU SEE?
          </p>
          <Button
            className="w-72 h-14 rounded-2xl text-2xl"
            title="START TRADING"
            href="/app/dashboard"
          />
        </div>
        <Footer />
      </div>
      {/* Background */}
      <div className="absolute top-[45%] left-[-10rem] z-0 rotate-[30deg] opacity-50 blur-sm ">
        <div className="h-[20rem] w-[20rem] relative">
          <Image src={"/tokenImages/bitcoin-logo.svg"} alt="BTC logo" fill />
        </div>
      </div>
      <div className="absolute top-[55%] right-[-14rem] z-0 rotate-[-30deg] opacity-50 blur-sm">
        <div className="h-[28rem] w-[25rem] relative">
          <Image src={"/tokenImages/solana-logo.svg"} alt="SOL logo" fill />
        </div>
      </div>
      <div className="absolute top-[70%] left-[-6rem] z-0 rotate-[0deg] opacity-50 blur-sm">
        <div className="h-[15rem] w-[18rem] relative">
          <Image src={"/tokenImages/binance-logo.svg"} alt="BNB logo" fill />
        </div>
      </div>
      <div className="absolute top-[85%] right-[-11rem] z-0 rotate-[-20deg] opacity-50 blur-sm">
        <div className="h-[25rem] w-[25rem] relative">
          <Image src={"/tokenImages/ethereum-logo.svg"} alt="ETH logo" fill />
        </div>
      </div>
      <div className="absolute top-[85%] left-[-11rem] z-0 rotate-[20deg] opacity-50 blur-sm">
        <div className="h-[25rem] w-[25rem] relative">
          <Image src={"/tokenImages/ethereum-logo.svg"} alt="ETH logo" fill />
        </div>
      </div>
    </>
  );
}
