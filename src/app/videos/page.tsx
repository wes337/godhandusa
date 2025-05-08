"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";
import "./videos.css";

const VIDEOS = [
  "1-smaller.mp4",
  "2-smaller.mp4",
  "1-smaller.mp4",
  "2-smaller.mp4",
];

const RANDOM_PHRASES = [
  "REALITY CORRUPTION",
  "FEED DESTABILIZATION",
  "DIMENSIONAL INTERFERENCE",
  "QUANTUM BIT ERROR",
  "NEURAL NETWORK FAILURE",
  "TEMPORAL ANOMALY",
  "SYSTEM BREACH",
  "CONNECTION FRAGMENTED",
  "DATA EXTRACTION ERROR",
  "PROTOCOL VIOLATION",
];

function getRandomPhrase() {
  return RANDOM_PHRASES[Math.floor(Math.random() * RANDOM_PHRASES.length)];
}

function randomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function reverseString(str: string) {
  return str.split("").reverse().join("");
}

export default function Videos() {
  const [videos, setVideos] = useState(
    VIDEOS.map((video) => ({
      video,
      phrase: getRandomPhrase(),
      percent: randomNumberBetween(0, 100),
      timestamp: Date.now() + randomNumberBetween(1, 10000),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setVideos((v) =>
        v.map((vid) => ({
          ...vid,
          timestamp:
            randomNumberBetween(1, 2) === 1
              ? Date.now() + randomNumberBetween(1, 10000)
              : vid.timestamp,
          phrase:
            randomNumberBetween(0, 5) === 1 ? getRandomPhrase() : vid.phrase,
          percent:
            randomNumberBetween(0, 5) === 1
              ? randomNumberBetween(0, 100)
              : vid.percent,
        }))
      );
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="videos">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <div className="videos">
        <div className="grid">
          {videos.map(({ video, phrase, percent, timestamp }, index) => {
            return (
              <div key={index} className="video">
                <div className="header">
                  <div className="title">CAM_0{index}</div>
                  <div className="status">READY</div>
                </div>
                <video
                  src={`/videos/${video}`}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="footer">
                  <div className="phrase">&gt; {phrase}</div>
                  <div className="timestamp">
                    &gt; {reverseString(timestamp.toString()).slice(0, 7)}
                  </div>
                  <div className="percent">[{percent}%]</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
