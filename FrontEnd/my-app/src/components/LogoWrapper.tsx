"use client";

import { getImage } from "@/lib/getImage";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ServerImageWrapperProps {
  src: string;
  alt: string;
}

export default function LogoWrapper({ src, alt }: ServerImageWrapperProps) {
  const [base64, setBase64] = useState("");

  useEffect(() => {
    const fetchImageData = async (imgSrc: string) => {
      if (imgSrc !== "/unknownToken.png") {
        try {
          const response = await fetch(`/api/getImageData?imgSrc=${imgSrc}`);

          if (!response.ok) {
            throw new Error("Failed to fetch data from API");
          }
          const data = await response.json();
          setBase64(data.base64);
        } catch (error) {
          console.error("Error loading image data:", error);
        }
      }
    };

    fetchImageData(src || "/unknownToken.png");
  }, []);

  return (
    <>
      {src !== "unknownToken.png" && base64 ? (
        <Image
          src={src}
          alt={alt}
          placeholder="blur"
          blurDataURL={base64}
          fill
          className="bg-white"
        />
      ) : (
        <Image src={src} alt={alt} fill className="bg-white" />
      )}
    </>
  );
}
