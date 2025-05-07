"use client";

import { useEffect, useLayoutEffect } from "react";

export default function FX({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    document.body.classList.remove("on");
    document.body.classList.add("off");
  }, []);

  useEffect(() => {
    document.body.classList.remove("off");
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
