import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";

interface navOption {
  href: string;
  name: string;
}

const NavOptions: navOption[] = [
  { name: "DASHBOARD", href: "/app/dashboard" },
  { name: "FORGE", href: "/app/forge" },
  { name: "POSITIONS", href: "/app/positions" },
];

export default function NavBar() {
  return (
    <>
      <div className="flex md:hidden">
        <SmNavBar />
      </div>
      <div className="hidden md:flex flex-row gap-x-4">
        {NavOptions.map((element, i) => (
          <NavOption href={element.href} name={element.name} key={i} />
        ))}
      </div>
    </>
  );
}

function NavOption({ href, name }: navOption) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`font-juraBold navOption text-white md:text-black md:text-base text-sm ${
        pathname.includes(href) && "active"
      }`}
    >
      {name}
    </Link>
  );
}

function SmNavBar() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <RxHamburgerMenu
        className="text-2xl cursor-pointer"
        onClick={() => setOpen(!open)}
      />
      <div
        className={`fixed left-1/2 -translate-x-1/2 transform z-50 bg-[#1a1a1a] w-full h-fit transition-all duration-300 ease-in-out ${
          open ? "bottom-0" : "-bottom-[100vh]"
        }`}
      >
        <div className="w-full h-fit py-4 flex flex-col items-center justify-center space-y-3">
          {NavOptions.map((element, i) => (
            <NavOption href={element.href} name={element.name} key={i} />
          ))}
        </div>
        <div
          className="absolute top-1 right-2 text-sm cursor-pointer text-white"
          onClick={() => setOpen(false)}
        >
          X
        </div>
      </div>
    </>
  );
}
