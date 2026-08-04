"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import "./splash-image.css";

const INTENSE_INTERVAL = 6000;
const INTENSE_DURATION = 1000;

const TINT = { r: 0x00, g: 0xff, b: 0x6a };

const MAX_SIZE = 1600;

const tintImage = (img: HTMLImageElement): HTMLCanvasElement => {
  const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;

  const sourceContext = source.getContext("2d");

  if (!sourceContext) {
    return source;
  }

  sourceContext.drawImage(img, 0, 0, width, height);

  const imageData = sourceContext.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      if (data[i + 3] === 0) {
        continue;
      }

      const luminance =
        (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;

      data[i] = TINT.r * luminance;
      data[i + 1] = TINT.g * luminance;
      data[i + 2] = TINT.b * luminance;

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) {
    return source;
  }

  const canvas = document.createElement("canvas");
  canvas.width = maxX - minX + 1;
  canvas.height = maxY - minY + 1;

  const context = canvas.getContext("2d");

  if (context) {
    context.putImageData(imageData, -minX, -minY);
  }

  return canvas;
};

const imageCache: Record<string, HTMLCanvasElement> = {};

const getImage = (src: string): Promise<HTMLCanvasElement> => {
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src]);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache[src] = tintImage(img);
      resolve(imageCache[src]);
    };
    img.src = src;
  });
};

interface SplashImageCanvasProps {
  src: string;
  intense: boolean;
}

const SplashImageCanvas = memo(({ src, intense }: SplashImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const isRenderingRef = useRef<boolean>(false);

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || isRenderingRef.current) return;

    isRenderingRef.current = true;

    try {
      const img = await getImage(src);

      const padding = 50;
      const width = img.width;
      const height = img.height;

      canvas.width = width + padding * 2;
      canvas.height = height + padding * 2;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const glitchEffect = () => {
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(padding, padding);

        const a = 30;
        const inc = intense ? 0.5 : 0.18;

        for (let i = 0; i < height; i++) {
          const dx = Math.floor(inc * (Math.random() - 0.5) * a);
          context.drawImage(img, 0, i, width, 1, dx, i, width, 1);
        }

        context.restore();

        animationRef.current = window.requestAnimationFrame(glitchEffect);
      };

      glitchEffect();
    } finally {
      isRenderingRef.current = false;
    }
  }, [src, intense]);

  useEffect(() => {
    renderCanvas();

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [renderCanvas, src, intense]);

  return <canvas ref={canvasRef} />;
});

SplashImageCanvas.displayName = "SplashImageCanvas";

export default function SplashImage({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [intense, setIntense] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getImage(src).then(() => {
      setImageLoaded(true);
    });
  }, [src]);

  useEffect(() => {
    if (!imageLoaded) return;

    const handleIntenseEffect = () => {
      setIntense(true);

      const timeout = setTimeout(() => {
        setIntense(false);
      }, INTENSE_DURATION);

      return timeout;
    };

    const initialTimeout = handleIntenseEffect();

    const interval = setInterval(() => {
      handleIntenseEffect();
    }, INTENSE_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [imageLoaded]);

  if (!imageLoaded) {
    return null;
  }

  return (
    <div
      className={`splashImage${className ? ` ${className}` : ""}${
        intense ? " intense" : ""
      }`}
    >
      <SplashImageCanvas src={src} intense={intense} />
    </div>
  );
}
