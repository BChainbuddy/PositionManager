import Image from "next/image";

export default function Background() {
  return (
    <div className="absolute z-10 top-0 bottom-0 left-0 right-0">
      <div className="relative h-full w-full">
        <Image alt="Background" src="/Background.png" fill />
      </div>
    </div>
  );
}
