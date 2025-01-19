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
      className="h-[3rem] w-[3rem] text-[#01ff39] transition-color duration-500 ease-out hover:text-[#ffe500] cursor-pointer active:-translate-x-10"
    />
  );
}
