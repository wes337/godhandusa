"use client";

import { useEffect } from "react";

export default function FX({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("on");
  }, []);

  return (
    <>
      <div className="overlay" />
      <div className="scanline" />
      {children}
    </>
  );
}
