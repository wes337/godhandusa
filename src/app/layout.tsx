import type { Metadata } from "next";
import Script from "next/script";
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
      <Script
        id="ze-snippet"
        src="https://static.zdassets.com/ekr/snippet.js?key=cf6b6b6b-5713-4606-ab9f-40c0f3b4073d"
        strategy="lazyOnload"
      />
      <Script id="zendesk-settings" strategy="lazyOnload">
        {`
          window.zESettings = {
            webWidget: { launcher: { mobile: { labelVisible: true } } },
          };
        `}
      </Script>
    </html>
  );
}
