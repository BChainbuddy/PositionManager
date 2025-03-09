import { motion, useAnimationControls } from "framer-motion";
import { TbHammer } from "react-icons/tb";

interface ForgeButtonProps {
  days: number;
  executionPrice: number;
}

export default function ForgeButton({
  days,
  executionPrice,
}: ForgeButtonProps) {
  const controls = useAnimationControls();

  const handleClick = () => {
    controls.start("forge");
  };

  const hammerVariants = {
    initial: { rotate: -90, opacity: 0, scaleX: 1 },
    forge: {
      rotate: [-90, -90, 0, 0, 0],
      opacity: [0, 1, 1, 1, 0],
      scaleX: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.05, 0.7, 0.95, 1],
      },
    },
  };

  const flippedHammerVariants = {
    initial: { rotate: -90, opacity: 0, scaleX: -1 },
    forge: {
      rotate: [-90, -90, 0, 0, 0],
      opacity: [0, 1, 1, 1, 0],
      scaleX: -1,
      transition: {
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.05, 0.7, 0.95, 1],
      },
    },
  };

  const buttonVariants = {
    initial: { boxShadow: "0px 0px 0px rgba(1, 255, 57, 1)" },
    forge: {
      boxShadow: [
        "0px 0px 0px rgba(1, 255, 57, 1)",
        "0px 0px 0px rgba(1, 255, 57, 1)",
        "0px 0px 20px rgba(1, 255, 57, 1)",
        "0px 0px 20px rgba(1, 255, 57, 1)",
        "0px 0px 0px rgba(1, 255, 57, 1)",
      ],
      transition: {
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.7, 0.7, 0.9, 1], // Keyframe times
      },
    },
  };
  return (
    <div className="relative w-24">
      <motion.button
        variants={buttonVariants}
        initial="initial"
        animate={controls} // Link to animation controls
        disabled={!executionPrice || !days}
        className={`flex items-center justify-center h-8 w-24 rounded-2xl text-black mt-6 ${
          executionPrice && days ? "bg-[#01FF39]" : "bg-[#01FF3980]"
        }`}
        onClick={handleClick}
      >
        FORGE
      </motion.button>
      <motion.div
        variants={hammerVariants}
        initial="initial"
        animate={controls}
        className="w-10 h-10 absolute bottom-0 -left-9"
      >
        <TbHammer className="h-full w-full text-[#01FF39]" />
      </motion.div>

      <motion.div
        variants={flippedHammerVariants}
        initial="initial"
        animate={controls}
        className="w-10 h-10 absolute bottom-0 -right-9 text-[#01FF39]"
      >
        <TbHammer className="h-full w-full" />
      </motion.div>
    </div>
  );
}
