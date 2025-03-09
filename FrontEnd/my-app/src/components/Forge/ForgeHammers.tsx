import { TbHammer } from "react-icons/tb";
import { motion } from "framer-motion";

export default function ForgeHammers({ controls }: any) {
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
  return (
    <>
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
    </>
  );
}
