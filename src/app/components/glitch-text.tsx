"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { randomNumberBetween, getGlitchLetter } from "../utils";
import "./glitch-text.css";

export default function GlitchText(props) {
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
    let seenLetters: string[] = [];

    const animate = (now?: number) => {
      if (!now) {
        now = Date.now();
      }

      const getRandomLetter = () => {
        return props.label.charAt(
          randomNumberBetween(0, props.label.length - 1)
        );
      };

      let letter = getRandomLetter();

      if (seenLetters.includes(letter)) {
        letter = getRandomLetter();
      }

      if (seenLetters.includes(letter)) {
        letter = getRandomLetter();
      }

      if (seenLetters.includes(letter)) {
        letter = getRandomLetter();
      }

      if (seenLetters.includes(letter)) {
        letter = getRandomLetter();
        seenLetters = [];
      }

      seenLetters.push(letter);

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
    <span
      className="glitchText"
      onPointerEnter={() => {
        if (props.hover) {
          glitchText();
        }
      }}
      onPointerLeave={() => {
        if (props.hover) {
          restoreText();
        }
      }}
    >
      {label}
    </span>
  );
}
