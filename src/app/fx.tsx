"use client";

import { useEffect } from "react";

export default function FX({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("offReverse");

    const timeout = setTimeout(() => {
      document.body.classList.remove("offReverse");
      document.body.classList.add("on");
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="overlay" />
      <div className="scanline" />
      {children}
    </>
  );
}
