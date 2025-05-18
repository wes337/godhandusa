"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { randomNumberBetween } from "../utils";
import Footer from "../components/footer";
import "./videos.css";

const VIDEOS = [
  {
    id: "disside",
    name: "DI$ SIDE",
    url: "P5EKMn7OQik?si=LAUaSzVfm7WRtF6H",
  },
  {
    id: "ridin",
    name: "RIDIN' IN THE WHIP PT. 2",
    url: "tD_92m8Te1Q?si=3Om--tujDFEYyA4u",
  },
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

function reverseString(str: string) {
  return str.split("").reverse().join("");
}

function getRandomText() {
  return reverseString(Date.now().toString()).slice(0, 7);
}

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    name: string;
    url: string;
  } | null>(null);

  return (
    <div className="videos">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
      <div className="videos">
        <div className="grid">
          {VIDEOS.map((video, index) => {
            return (
              <Video
                key={index}
                video={video}
                index={index}
                onClick={(video) => setSelectedVideo(video)}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function VideoPlayer({
  video,
  onClose,
}: {
  video: { id: string; name: string; url: string };
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <>
      <div className="videoPlayerBackdrop" onClick={onClose} />
      <div className="videoPlayer">
        <div className="header">
          <span>VIDEO &gt;&gt; {video.name}</span>
          <button className="close" onClick={onClose}>
            Exit
          </button>
        </div>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${video.url}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </>
  );
}

function Video({
  video,
  index,
  onClick,
}: {
  video: { id: string; name: string; url: string };
  index: number;
  onClick: (video: { id: string; name: string; url: string }) => void;
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [phrase, setPhrase] = useState(getRandomPhrase());
  const [percent, setPercent] = useState(randomNumberBetween(0, 100));
  const [random, setRandom] = useState(getRandomText());
  const [showStatic, setShowStatic] = useState(false);
  const [preview, setPreview] = useState(1);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const interval = setInterval(() => {
      setPreview(randomNumberBetween(1, 2));
      setShowStatic(true);

      timeout = setTimeout(() => {
        setShowStatic(false);
      }, 300);
    }, (index + 1) * 2000);

    return () => {
      clearInterval(interval);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase(getRandomPhrase());
      setPercent(randomNumberBetween(0, 100));
      setRandom(getRandomText());
    }, (index + 1) * 1500);

    return () => {
      clearInterval(interval);
    };
  }, [index]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onMouseEnter = () => {
    setShowStatic(true);

    timeoutRef.current = setTimeout(() => {
      setShowStatic(false);
    }, 300);
  };

  const onMouseLeave = () => {
    setShowStatic(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div
      className="video"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(video)}
    >
      <div className="header">
        <div className="title">
          CAM_0{index} <span>&gt;&gt; {video.name}</span>
        </div>
        <div className="status">READY</div>
      </div>
      <video
        className={`static ${showStatic ? "show" : ""}`}
        src={`/videos/static.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />
      <Image
        className="preview"
        key={preview}
        src={`/videos/${video.id}-${preview}.gif`}
        alt=""
        width={320}
        height={240}
      />
      <div className="videoFooter">
        <div className="phrase">&gt; {phrase}</div>
        <div className="timestamp">&gt; {random}</div>
        <div className="percent">[{percent}%]</div>
      </div>
    </div>
  );
}
