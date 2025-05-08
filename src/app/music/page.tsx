"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ALBUMS } from "../data";
import Link from "next/link";
import Footer from "../footer";
import "./music.css";

function calculateTime(seconds: number) {
  try {
    const _minute = Math.floor(seconds / 60);
    const minute = _minute < 10 ? `0${_minute}` : `${_minute}`;
    const _second = Math.floor(seconds % 60);
    const second = _second < 10 ? `0${_second}` : `${_second}`;
    return `${minute}:${second}`;
  } catch {
    return `00:00`;
  }
}

export default function Music() {
  const router = useRouter();
  const [currentAlbum, setCurrentAlbum] = useState(ALBUMS[0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const gotoPreviousAlbum = () => {
    const currentIndex = ALBUMS.findIndex(
      (album) => album.title === currentAlbum.title
    );
    const previousIndex = (currentIndex - 1 + ALBUMS.length) % ALBUMS.length;
    setCurrentAlbum(ALBUMS[previousIndex]);
  };

  const gotoNextAlbum = () => {
    const currentIndex = ALBUMS.findIndex(
      (album) => album.title === currentAlbum.title
    );
    const nextIndex = (currentIndex + 1) % ALBUMS.length;
    setCurrentAlbum(ALBUMS[nextIndex]);
  };

  return (
    <div className="fillAvailable flex flex-col items-center justify-center">
      <Link
        href="#"
        className="logo"
        onClick={() => {
          document.body.classList.remove("on");
          document.body.classList.add("off");

          timeoutRef.current = setTimeout(() => {
            document.body.classList.remove("off");
            document.body.classList.add("on");

            router.push("/");
          }, 500);
        }}
      >
        <Image
          src={`/hand-small.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <div className="mt-auto">
        <div className="album font-mono">
          <div className="flex">
            <button
              className="cursor-pointer w-[20%] text-[2rem] tracking-[-4px] text-terminal-green hover:text-white"
              onClick={gotoPreviousAlbum}
            >
              &lt;&lt;
            </button>
            <div className="cover w-full">
              <Image src={currentAlbum.cover} alt="" width={200} height={200} />
            </div>
            <button
              className="cursor-pointer w-[20%] text-[2rem] tracking-[-4px] text-terminal-green hover:text-white"
              onClick={gotoNextAlbum}
            >
              &gt;&gt;
            </button>
          </div>
          <div className="title">{currentAlbum.title}</div>
          <div className="w-full text-[12px] text-right uppercase text-off-white/75 uppercase">
            [{currentAlbum.tracks.length} Tracks]
          </div>
          <div className="tracks h-[30vh] overflow-auto">
            {currentAlbum.tracks.map((track) => {
              return (
                <Link
                  key={track.id}
                  className="w-full flex cursor-pointer focus:bg-terminal-green/10 hover:bg-terminal-green/10"
                  href={`https://open.spotify.com/track/${track.id}`}
                  target="_blank"
                >
                  <div className="w-[40px] text-terminal-green">
                    {track.trackNo}
                  </div>
                  <div className="w-[256px] text-[14px] leading-[24px] whitespace-nowrap overflow-hidden text-ellipsis tracking-tighter">
                    {track.title}
                  </div>
                  <div className="ml-auto text-off-white/75 text-[12px] leading-[24px]">
                    {calculateTime(track.durationMS / 1000)}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="w-full border-t-1 mt-1 pt-1 border-off-white/25 uppercase text-xs text-off-white/50 text-right">
            [End of System Input]
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
