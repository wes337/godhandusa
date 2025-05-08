"use client";

export default function FX({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="scanlines" />
      <div className="textureOverlay" />
      {children}
    </>
  );
}
