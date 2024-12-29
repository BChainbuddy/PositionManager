import Image from "next/image";

interface ServerImageWrapperProps {
  src: string;
  blurImg: string;
  alt: string;
}

export default function LogoWrapper({
  src,
  blurImg,
  alt,
}: ServerImageWrapperProps) {
  return (
    <>
      {src === "" ? (
        <Image src={"/unknownToken.png"} alt={alt} fill className="bg-white" />
      ) : (
        <Image
          src={src}
          alt={alt}
          placeholder="blur"
          blurDataURL={blurImg}
          fill
          className="bg-white"
        />
      )}
    </>
  );
}
