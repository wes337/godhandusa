"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SVG from "react-inlinesvg";
import "./footer.css";

const MESSAGES = [
  { pre: "Grlfrnd Status", post: "Pregnant" },
  { pre: "Guns Owned", post: "999+" },
  { pre: "Porch", post: "Hopped Off" },
  { pre: "Bed Status", post: "Shit-covered" },
  { pre: "Fngr Posn", post: "Trigger" },
  { pre: "Whps Rdn", post: Math.round(Math.random() * 1000) },
  { pre: "Pockets", post: "Over-Encumbered" },
  { pre: "Smck lvls", post: "Talked" },
  { pre: "Games Played", post: "0" },
  { pre: "Uh huh", post: "huh" },
  { pre: "Eating", post: "Good" },
  { pre: "Loc", post: "Outside" },
  { pre: "Money", post: "Need sum mo" },
  { pre: "Bitches Stomped", post: Math.round(Math.random() * 1000) },
];

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function randomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Footer() {
  const pathname = usePathname();
  const [message, setMessage] = useState(0);
  const [time, setTime] = useState("");
  const [showExtras, setShowExtras] = useState(pathname === "/");
  const [showBackButton, setShowBackButton] = useState(pathname !== "/");
  const [speed, setSpeed] = useState("fast");
  const [date, setDate] = useState("");

  useEffect(() => {
    setShowExtras(pathname === "/");
    setShowBackButton(pathname !== "/");
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
      setDate(new Date().toISOString());
    }, 1000);

    setTime(getCurrentTime());
    setDate(new Date().toISOString());

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage((currentMessage) => {
        const nextMessage = currentMessage + 1;

        if (nextMessage > MESSAGES.length - 1) {
          return 0;
        }

        return nextMessage;
      });

      const random = randomNumberBetween(1, 3);

      if (random === 1) {
        setSpeed("slow");
      } else if (random === 2) {
        setSpeed("medium");
      } else {
        setSpeed("fast");
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {showBackButton && (
        <Link className="backButton" href="/">
          Return
        </Link>
      )}
      <div className="footer">
        {showExtras && (
          <div className="links">
            <div className="label">LNKS</div>
            <div className="bracket">[</div>
            <Link
              className="link"
              href="https://www.instagram.com/godhandusa"
              target="_blank"
            >
              IG
            </Link>
            <Link
              className="link"
              href="https://www.youtube.com/channel/UCO4nbhid2cOtOpWrlaQPGoQ"
              target="_blank"
            >
              YT
            </Link>
            <Link
              className="link"
              href="https://open.spotify.com/artist/52XZBIfTRn9iyM7QLf6DmX"
              target="_blank"
            >
              SPFY
            </Link>
            <Link
              className="link"
              href="https://soundcloud.com/godhandusa"
              target="_blank"
            >
              SC
            </Link>
            <div className="bracket">]</div>
          </div>
        )}
        <div className="legal">℗ 2025 Eye and Hand Society</div>
        <div className="statusBar">
          <div className="time">
            System Time: <span>{time}</span>
          </div>
          <div className="date">[{date}]</div>
          <div className="message">
            <div className="pre">{MESSAGES[message].pre}</div>
            <div className="post">{MESSAGES[message].post}</div>
            <div className={`icon ${speed}`}>
              <SVG src={`/solid-speed-${speed}.svg`} width={16} height={16} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
