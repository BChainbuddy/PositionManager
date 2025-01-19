import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="flex flex-row gap-x-4">
      {NavOptions.map((element) => (
        <NavOption href={element.href} name={element.name} />
      ))}
    </div>
  );
}

function NavOption({ href, name }: navOption) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`font-juraBold navOption ${
        pathname.includes(href) && "active"
      }`}
    >
      {name}
    </Link>
  );
}
