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
        <div className="flex flex-col md:mt-32 mt-20">
          <p className="md:text-4xl text-xl text-center bg-gradient-to-r from-[#01FF39] to-[#FFE500] bg-clip-text text-transparent font-juraBold">
            Unlock the Power of Decentralized Trading
          </p>
          <div className="flex flex-row bg-gradient-to-br from-[#01FF39] to-[#FFE500] justify-evenly items-center md:py-10 py-4 md:mt-10 mt-5">
            <div className="text-[#041516]">
              <p className="md:w-[30rem] w-[90%] md:text-xl text-sm mx-auto">
                <span className="font-interBold">Trade Forge</span> is a
                cutting-edge decentralized application (dApp) designed to{" "}
                <span className="font-interBold">streamline</span> and{" "}
                <span className="font-interBold">optimize</span> your{" "}
                <span className="font-interBold">trading experience</span> on
                Uniswap V2 and V3 forks.
              </p>
              <p className="md:w-[30rem] w-[90%] md:text-xl text-sm md:mt-8 mt-4 mx-auto">
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
            <div className="relative h-[25rem] w-[25rem] rounded-md overflow-hidden md:block hidden">
              <Image src="/TradeForge.webp" alt="Trade Forge" fill />
            </div>
          </div>
        </div>
        <div className="md:mt-24 mt-12 relative">
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
        <div className="md:mt-52 mt-28">
          <div className="flex flex-col text-center font-juraBold">
            <p className="md:text-4xl text-2xl font-jura text-white">
              Why Trade Forge?
            </p>
            <p className="md:text-xl text-base text-[#01FF39]">
              Trade Smarter, Not Harder
            </p>
          </div>
          <div className="flex md:flex-row flex-col md:space-x-32 space-y-10 justify-center md:mt-24 mt-10">
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
        <div className="md:mt-52 mt-16 flex flex-col justify-center items-center space-y-5">
          <p className="text-center font-juraBold text-white md:text-2xl text-lg">
            LIKE WHAT YOU SEE?
          </p>
          <Button
            className="md:w-72 md:h-14 w-40 h-9 rounded-2xl md:text-2xl text-lg"
            title="START TRADING"
            href="/app/dashboard"
          />
        </div>
        <Footer />
      </div>
      {/* Background */}
      <div className="absolute top-[45%] md:left-[-10rem] left-[-5rem] z-0 rotate-[30deg] opacity-50 blur-sm ">
        <div className="md:h-[20rem] md:w-[20rem] h-[12rem] w-[12rem] relative">
          <Image src={"/tokenImages/bitcoin-logo.svg"} alt="BTC logo" fill />
        </div>
      </div>
      <div className="absolute md:top-[55%] top-[52%] md:right-[-14rem] right-[-8rem] z-0 rotate-[-30deg] opacity-50 blur-sm">
        <div className="md:h-[28rem] md:w-[25rem] h-[18rem] w-[15rem] relative">
          <Image src={"/tokenImages/solana-logo.svg"} alt="SOL logo" fill />
        </div>
      </div>
      <div className="absolute md:top-[70%] top-[67%] md:left-[-6rem] left-[-5rem] z-0 rotate-[0deg] opacity-50 blur-sm">
        <div className="md:h-[15rem] md:w-[18rem] h-[10rem] w-[13rem] relative">
          <Image src={"/tokenImages/binance-logo.svg"} alt="BNB logo" fill />
        </div>
      </div>
      <div className="absolute md:top-[85%] top-[90%] md:right-[-11rem] right-[-5rem] z-0 rotate-[-20deg] opacity-50 blur-sm">
        <div className="md:h-[25rem] md:w-[25rem] h-[12rem] w-[12rem] relative">
          <Image src={"/tokenImages/ethereum-logo.svg"} alt="ETH logo" fill />
        </div>
      </div>
      <div className="absolute md:top-[85%] top-[90%] md:left-[-11rem] left-[-5rem] z-0 rotate-[20deg] opacity-50 blur-sm">
        <div className="md:h-[25rem] md:w-[25rem] h-[12rem] w-[12rem] relative">
          <Image src={"/tokenImages/ethereum-logo.svg"} alt="ETH logo" fill />
        </div>
      </div>
    </>
  );
}
