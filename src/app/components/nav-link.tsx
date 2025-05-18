"use client";

import Link from "next/link";
import GlitchText from "./glitch-text";
import "./nav-link.css";

export default function NavLink(props) {
  return (
    <div className="navLink">
      <Link href={props.href}>
        <GlitchText label={props.label} hover />
      </Link>
    </div>
  );
}
