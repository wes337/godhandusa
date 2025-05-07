"use client";

export default function FX({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="overlay" />
      <div className="scanline" />
      {children}
    </>
  );
}
