"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./footer.css";

const MESSAGES = [
  { pre: "Grlfrnd Status", post: "Pregnant" },
  { pre: "Guns Owned", post: "999+" },
  { pre: "Porch", post: "Hopped Off" },
  { pre: "Bed Status", post: "Shit-covered" },
  { pre: "Fngr Posn", post: "Trigger" },
  { pre: "Whps Rdn", post: "28221" },
  { pre: "Pockets", post: "Over-Encumbered" },
  { pre: "Smck lvls", post: "Talked" },
  { pre: "Games Played", post: "0" },
];

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function Footer() {
  const pathname = usePathname();
  const [message, setMessage] = useState(0);
  const [time, setTime] = useState(getCurrentTime());
  const [showExtras, setShowExtras] = useState(false);

  useEffect(() => {
    setShowExtras(pathname === "/");
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

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
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="footer">
      {showExtras && (
        <div className="links">
          <div className="label">LNKS</div>
          <div className="bracket">[</div>
          <div className="link">IG</div>
          <div className="link">YT</div>
          <div className="link">SPFY</div>
          <div className="link">SC</div>
          <div className="bracket">]</div>
        </div>
      )}
      <div className="legal">℗ 2025 Eye and Hand Society</div>
      <div className="statusBar">
        <div className="time">
          System Time: <span>{time}</span>
        </div>
        <div className="date">[{new Date().toUTCString()}]</div>
        <div className="message">
          <div className="pre">{MESSAGES[message].pre}</div>
          <div className="post">{MESSAGES[message].post}</div>
        </div>
      </div>
    </div>
  );
}
