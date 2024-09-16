import Image from "next/image";

interface StepCardProps {
  header?: boolean;
  stepNumber: string;
  title: string;
  description: string;
  imageSrc: string;
  left: boolean;
}

export default function StepCard({
  header,
  stepNumber,
  title,
  description,
  imageSrc,
  left,
}: StepCardProps) {
  return (
    <div className="flex flex-row justify-around items-center mt-16">
      {left && (
        <div className="w-[25rem] h-[25rem] relative">
          <Image src={imageSrc} alt={title} fill />
        </div>
      )}
      <div className="text-white">
        {header && (
          <p className="font-juraBold text-3xl w-[20rem] text-center">
            Seamless Trading in Three Easy Steps
          </p>
        )}
        <div className="w-[25rem] mt-10">
          <p className="font-inter">
            <span className="text-[#01FF39]">{stepNumber}:</span> {title}
          </p>
          <p className="font-inter text-white/65">{description}</p>
        </div>
      </div>
      {!left && (
        <div className="w-[25rem] h-[25rem] relative">
          <Image src={imageSrc} alt={title} fill />
        </div>
      )}
    </div>
  );
}
