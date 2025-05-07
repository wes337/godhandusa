"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";

const NUMBER_OF_GRAPHICS = 7;
const ROTATION_INTERVAL = 6000;
const INTENSE_DURATION = 2000;

const preloadImages = () => {
  for (let i = 1; i <= NUMBER_OF_GRAPHICS; i++) {
    const img = new Image();
    img.src = `/graphics/graphic-${i}.png`;
  }
};

const imageCache: Record<number, HTMLImageElement> = {};
const getImage = (src: number): HTMLImageElement => {
  if (!imageCache[src]) {
    const img = new Image();
    img.src = `/graphics/graphic-${src}.png`;
    imageCache[src] = img;
  }
  return imageCache[src];
};

interface GlitchCanvasProps {
  src: number;
  intense: boolean;
  maxDisplacement?: number;
}

const GlitchCanvas = memo(({ src, intense }: GlitchCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = getImage(src);

    if (!img.complete) {
      img.onload = renderCanvas;
      return;
    }

    const padding = 50;
    const width = img.width;
    const height = img.height;

    canvas.width = width + padding * 2;
    canvas.height = height + padding * 2;

    const context = canvas.getContext("2d");
    if (!context) return;

    const glitchEffect = () => {
      if (!context) return;

      const padding = 50;
      const a = 25;
      const inc = intense ? 0.5 : 0.18;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.translate(padding, padding);

      for (let i = 0; i < height; i++) {
        const dx = Math.floor(inc * (Math.random() - 0.5) * a);
        context.drawImage(img, 0, i, width, 1, dx, i, width, 1);
      }

      context.restore();

      animationRef.current = window.requestAnimationFrame(glitchEffect);
    };

    glitchEffect();
  }, [src, intense]);

  useEffect(() => {
    renderCanvas();

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [renderCanvas]);

  return <canvas ref={canvasRef} />;
});

GlitchCanvas.displayName = "GlitchCanvas";

export default function ImageGlitch() {
  const [src, setSrc] = useState(7);
  const [intense, setIntense] = useState(false);

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSrc((currentSrc) => {
        return currentSrc === NUMBER_OF_GRAPHICS ? 1 : currentSrc + 1;
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIntense(true);
    const initialTimeout = setTimeout(() => {
      setIntense(false);
    }, INTENSE_DURATION);

    const interval = setInterval(() => {
      setIntense(true);

      const timeout = setTimeout(() => {
        setIntense(false);
      }, INTENSE_DURATION);

      return () => clearTimeout(timeout);
    }, ROTATION_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="imageGlitch">
      <GlitchCanvas src={src} intense={intense} />
    </div>
  );
}
