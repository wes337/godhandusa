"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  icon?: string;
  children: React.ReactNode;
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeout = timeoutRef.current;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const onClick = () => {
    document.body.classList.remove("on");
    document.body.classList.add("off");

    timeoutRef.current = setTimeout(() => {
      document.body.classList.remove("off");
      document.body.classList.add("on");
    }, 500);
  };

  return (
    <Link
      className="link flex items-center gap-3 text-center font-sans text-[28px] uppercase group w-full bg-white/10 hover:bg-white/15"
      href={href}
      onClick={onClick}
    >
      {icon && (
        <Image
          className="invert opacity-50 group-hover:opacity-100 transition-opacity"
          src={icon}
          alt=""
          width={24}
          height={24}
        />
      )}
      <span className="w-full">{children}</span>
    </Link>
  );
}
