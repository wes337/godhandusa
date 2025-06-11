import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import FX from "./components/fx";
import Static from "./components/static";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "GODHANDUSA",
  description: "The official website for GODHANDUSA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={shareTechMono.variable}>
        <FX />
        <Static />
        {children}
      </body>
    </html>
  );
}
