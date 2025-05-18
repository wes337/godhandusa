"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SHOWS from "../constants/shows";
import Link from "next/link";
import Footer from "../components/footer";
import GlitchText from "../components/glitch-text";
import "./shows.css";

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function Shows() {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="shows">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <div className="list">
        <div className="headers">
          <div className="header">LOC</div>
          <div className="header">TIMESTAMPTZ</div>
          <div className="header">TX</div>
        </div>
        {SHOWS.map((show, index) => {
          return (
            <Link
              key={index}
              className="show"
              href={show.ticketLink}
              target="_blank"
            >
              <div className="location">
                <span className="city">
                  <GlitchText label={show.city} />
                </span>
                <span className="venue">
                  <GlitchText label={show.venue} />
                </span>
              </div>
              <div className="date">
                <GlitchText label={show.date} />
              </div>
              <div className="tickets">
                <span>
                  <GlitchText label={"Get"} hover />
                </span>
                <span>
                  <GlitchText label={"Tickets"} hover />
                </span>
              </div>
            </Link>
          );
        })}
        <div className="more">
          <GlitchText label={" More shows to be announced"} />
        </div>
        <div className="clocks">
          <div className="uptime">[Uptime: 17:08:28]</div>
          <div className="time">[System Time: {time}]</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
