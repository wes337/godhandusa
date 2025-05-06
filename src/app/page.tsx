import Image from "next/image";
import Link from "next/link";
import ImageGlitch from "./image-glitch";

export const metadata = {
  title: "GODHANDUSA",
};

export default function Home() {
  return (
    <div className="fillAvailable w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-8">
      <div className="scanline" />
      <div className="mt-auto">
        <ImageGlitch />
      </div>
      <div className="flex flex-col gap-2 mt-auto translate-y-[20vh]">
        <NavLink href="/">Music</NavLink>
        <NavLink href="/">Videos</NavLink>
        <NavLink href="/">Shows</NavLink>
        <NavLink href="/">Merch</NavLink>
      </div>
      <div className="footer font-mono mt-auto mb-4 text-xs uppercase text-white text-center tracking-tighter whitespace-nowrap">
        Copyright © 2025 GODHANDUSA® All Rights Reserved
      </div>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="link text-center font-sans text-[28px] uppercase group"
      href={href}
    >
      {children}
    </Link>
  );
}
