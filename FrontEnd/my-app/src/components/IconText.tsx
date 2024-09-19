import Image from "next/image";

interface IconTextProps {
  src: string;
  text: string;
  alt: string;
}

export default function IconText({ src, text, alt }: IconTextProps) {
  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <Image src={src} alt={alt} height={100} width={100} />
      <div className="font-juraBold text-white w-[10rem] text-center">
        {text}
      </div>
    </div>
  );
}
