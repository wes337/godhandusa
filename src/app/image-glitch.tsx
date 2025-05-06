"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";

const NUMBER_OF_GRAPHICS = 7;

const preloadImages = () => {
  for (let i = 1; i <= NUMBER_OF_GRAPHICS; i++) {
    const img = new Image();
    img.src = `/graphics/graphic-${i}.png`;
  }
};

export default function ImageGlitch() {
  const [src, setSrc] = useState(7);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [intense, setIntense] = useState(false);

  useLayoutEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSrc((currentSrc) => {
        const nextSrc = currentSrc === NUMBER_OF_GRAPHICS ? 1 : currentSrc + 1;
        // Preload the image after next
        const nextNextSrc = nextSrc === NUMBER_OF_GRAPHICS ? 1 : nextSrc + 1;
        const img = new Image();
        img.src = `/graphics/graphic-${nextNextSrc}.png`;
        return nextSrc;
      });
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const interval = setInterval(() => {
      setIntense(true);

      timeout = setTimeout(() => {
        setIntense(false);
      }, 2000);
    }, 6000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  useEffect(() => {
    setIntense(true);

    timeoutRef.current = setTimeout(() => {
      setIntense(false);
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const img = new Image();
    img.src = `/graphics/graphic-${src}.png`;

    const width = img.width + 50;
    const height = img.height;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const set = () => {
      if (!context) {
        return;
      }

      const width = img.width + 50;
      const height = img.height + 50;

      const a = 25;
      let dx = 0;

      const run = () => {
        if (!context) {
          return;
        }

        let i = 0;
        let j = 0;
        let inc = 0;
        context.clearRect(-a, -a, width, height);
        inc = intense === true ? 0.5 : 0.18;

        for (j = 0; j <= height; i = 0 <= height ? ++j : --j) {
          dx = ~~(inc * (Math.random() - 0.5) * a);
          context.drawImage(img, 0, i, width, 1, dx, i, width, 1);
        }

        window.requestAnimationFrame(run);
      };

      return run();
    };

    img.onload = () => set();
  }, [src, intense]);

  return (
    <div className="imageGlitch">
      <canvas ref={canvasRef} className="translate-x-[25px]" />
    </div>
  );
}
