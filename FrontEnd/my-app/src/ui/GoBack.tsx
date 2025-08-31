"use client";

import { useRouter } from "next/navigation";
import { IoChevronBackCircleOutline } from "react-icons/io5";

export default function GoBack() {
  const router = useRouter();

  return (
    <IoChevronBackCircleOutline
      onClick={() => {
        router.back();
      }}
      className="md:h-[3rem] md:w-[3rem] h-[2rem] w-[2rem] text-[#01ff39] transition-color duration-500 ease-out hover:text-[#ffe500] cursor-pointer active:-translate-x-10"
    />
  );
}
