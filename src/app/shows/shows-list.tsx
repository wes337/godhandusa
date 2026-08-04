"use client";

import Image from "next/image";
import Link from "next/link";
import { Show } from "@/lib/shows";
import { SHOW_RACING_THOUGHTS_RECORDS_LINK } from "@/utils";
import Footer from "@/components/footer";
import GlitchText from "@/components/glitch-text";
import NavLink from "@/components/nav-link";
import SplashImage from "@/components/splash-image";
import "./shows.css";

export default function ShowsList({
  shows,
  home = false,
}: {
  shows: Show[];
  home?: boolean;
}) {
  return (
    <div className={home ? "shows home" : "shows"}>
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      {home && SHOW_RACING_THOUGHTS_RECORDS_LINK && (
        <div className="new">
          <a
            href="https://www.racingthoughtsrecords.com/godhandusa"
            target="blank"
            rel="noreferrer"
          >
            New Physical Media
          </a>
        </div>
      )}
      {home && (
        <SplashImage src="/call-to-worship.png" className="banner" />
      )}
      <div className="list">
        <div className="headers">
          <div className="header">LOC</div>
          <div className="header">TIMESTAMPTZ</div>
          <div className="header">TX</div>
        </div>
        {shows.map((show) => {
          const content = (
            <>
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
              <div
                className={show.soldOut ? "tickets sold-out" : "tickets"}
              >
                {show.soldOut ? (
                  <>
                    <span>
                      <GlitchText label={"Sold"} hover />
                    </span>
                    <span>
                      <GlitchText label={"Out"} hover />
                    </span>
                  </>
                ) : show.ticketLink ? (
                  <>
                    <span>
                      <GlitchText label={"Get"} hover />
                    </span>
                    <span>
                      <GlitchText label={"Tickets"} hover />
                    </span>
                  </>
                ) : (
                  <span>
                    <GlitchText label={"TBA"} hover />
                  </span>
                )}
              </div>
            </>
          );

          if (!show.ticketLink) {
            return (
              <div key={show.id} className="show no-link">
                {content}
              </div>
            );
          }

          return (
            <Link
              key={show.id}
              className="show"
              href={show.ticketLink}
              target="_blank"
            >
              {content}
            </Link>
          );
        })}
        <div className="more">
          <GlitchText label={" More shows to be announced"} />
        </div>
      </div>
      {home && (
        <div className="nav">
          <NavLink href="/music" label="Music" />
          <NavLink href="/videos" label="Videos" />
          <NavLink href="/merch" label="Merch" />
        </div>
      )}
      <Footer />
    </div>
  );
}
