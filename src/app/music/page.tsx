"use client";

import { useState } from "react";
import Image from "next/image";
import ALBUMS from "../constants/albums";
import Link from "next/link";
import Footer from "../components/footer";
import "./music.css";
import GlitchText from "../components/glitch-text";

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
  const [currentAlbum, setCurrentAlbum] = useState(ALBUMS[2]);

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
    <div className="music">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <div className="albums">
        <div className="album">
          <div className="cover">
            <button onClick={gotoPreviousAlbum}>&lt;&lt;</button>
            <div
              className="image"
              onClick={() =>
                window.open(
                  `https://open.spotify.com/album/${currentAlbum.id}`,
                  "_blank"
                )
              }
            >
              <Image src={currentAlbum.cover} alt="" width={200} height={200} />
            </div>
            <button onClick={gotoNextAlbum}>&gt;&gt;</button>
          </div>
          <div className="title">
            <GlitchText label={currentAlbum.title} />
          </div>
          <div className="details">
            <div className="releaseDate">
              <GlitchText
                label={`[ONLINE ${new Date(
                  currentAlbum.releaseDate
                ).toISOString()}]`}
              />
            </div>
            <div className="spacing">-----</div>
            <div className="trackCount">
              <GlitchText label={`[${currentAlbum.tracks.length} Tracks]`} />
            </div>
          </div>
          <div className="tracks">
            {currentAlbum.tracks.map((track) => {
              return (
                <Link
                  key={track.id}
                  className="track"
                  href={`https://open.spotify.com/track/${track.id}`}
                  target="_blank"
                >
                  <div className="trackNumber">{track.trackNo}</div>
                  <div className="trackTitle">
                    <GlitchText label={track.title} hover />
                  </div>
                  <div className="duration">
                    {calculateTime(track.durationMS / 1000)}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="flair">
            <GlitchText label={`[End of System Input]`} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
