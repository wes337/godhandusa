"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import "./splash-image.css";

const NUMBER_OF_GRAPHICS = 1;
const ROTATION_INTERVAL = 6000;
const INTENSE_DURATION = 1000;

const preloadImages = () => {
  const promises: any[] = [];
  for (let i = 1; i <= NUMBER_OF_GRAPHICS; i++) {
    const img = new Image();
    const promise = new Promise((resolve) => {
      img.onload = () => resolve(img);
      img.src = `/graphics/graphic-${i}.png`;
    });
    promises.push(promise);
  }
  return Promise.all(promises);
};

const imageCache: Record<number, HTMLImageElement> = {};

const getImage = (src: number): Promise<HTMLImageElement> => {
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src]);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.src = `/graphics/graphic-${src}.png`;
  });
};

interface SplashImageCanvasProps {
  src: number;
  intense: boolean;
  maxDisplacement?: number;
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

export default function SplashImage() {
  const [src, setSrc] = useState(8);
  const [intense, setIntense] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    preloadImages().then(() => {
      setImagesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded || NUMBER_OF_GRAPHICS === 1) return;

    const interval = setInterval(() => {
      setSrc((currentSrc) => {
        return currentSrc === NUMBER_OF_GRAPHICS ? 1 : currentSrc + 1;
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  useEffect(() => {
    if (!imagesLoaded) return;

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
    }, ROTATION_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [imagesLoaded]);

  if (!imagesLoaded) {
    return <div className="splashImage">Loading...</div>;
  }

  return (
    <div className={`splashImage${intense ? " intense" : ""}`}>
      <SplashImageCanvas src={src} intense={intense} />
    </div>
  );
}
