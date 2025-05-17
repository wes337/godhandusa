"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import "./nav-link.css";

function randomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getGlitchLetter(letter: string) {
  switch (letter.toLowerCase()) {
    case "m":
      return "^";
    case "u":
      return "v";
    case "s":
      return "$";
    case "i":
      return "1";
    case "c":
      return "(";
    case "v":
      return "\\";
    case "d":
      return "*";
    case "e":
      return "3";
    case "o":
      return "0";
    case "h":
      return "6";
    case "w":
      return "@";
    case "r":
      return "4";
    default:
      return letter;
  }
}

export default function NavLink(props) {
  const [label, setLabel] = useState(props.label);
  const animationFrame = useRef<number | null>(null);
  const animationTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationEndTimeout = useRef<NodeJS.Timeout | null>(null);

  const restoreText = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }

    setLabel(props.label);
  }, [props.label]);

  const glitchText = useCallback(() => {
    const animate = (now?: number) => {
      if (!now) {
        now = Date.now();
      }

      const letter = props.label.charAt(
        randomNumberBetween(0, props.label.length - 1)
      );

      const glitchLabel = props.label.replace(letter, getGlitchLetter(letter));
      setLabel(glitchLabel);

      animationTimeout.current = setTimeout(() => {
        animationFrame.current = requestAnimationFrame(animate);
      }, 50);
    };

    animationFrame.current = requestAnimationFrame(animate);

    animationEndTimeout.current = setTimeout(
      () => restoreText(),
      500 * randomNumberBetween(2, 5)
    );
  }, [props.label, restoreText]);

  useEffect(() => {
    glitchText();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [glitchText]);

  return (
    <div
      className="navLink"
      onPointerEnter={() => glitchText()}
      onPointerLeave={() => restoreText()}
    >
      <Link href={props.href}>{label}</Link>
    </div>
  );
}
