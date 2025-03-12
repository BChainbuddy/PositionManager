import Link from "next/link";

interface ButtonProps {
  href: string;
  className?: string;
  title: string;
}

export default function Button({ href, className, title }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`bg-[#01ff39] text-black font-juraBold flex justify-center items-center ${className}`}
    >
      {title}
    </Link>
  );
}
