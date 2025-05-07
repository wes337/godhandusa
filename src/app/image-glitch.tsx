"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";

const NUMBER_OF_GRAPHICS = 7;
const ROTATION_INTERVAL = 6000;
const INTENSE_DURATION = 2000;

// Improved preloading function that returns a promise
const preloadImages = () => {
  const promises = [];
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

// Improved image cache
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

interface GlitchCanvasProps {
  src: number;
  intense: boolean;
  maxDisplacement?: number;
}

const GlitchCanvas = memo(({ src, intense }: GlitchCanvasProps) => {
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
      if (!context) return;

      // Cancel any existing animation before starting a new one
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const glitchEffect = () => {
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(padding, padding);

        const a = 25;
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

  // Only re-render when src or intense changes
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

GlitchCanvas.displayName = "GlitchCanvas";

export default function ImageGlitch() {
  const [src, setSrc] = useState(7);
  const [intense, setIntense] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Load all images before starting the effect
  useEffect(() => {
    preloadImages().then(() => {
      setImagesLoaded(true);
    });
  }, []);

  // Only start animations after images are loaded
  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setSrc((currentSrc) => {
        return currentSrc === NUMBER_OF_GRAPHICS ? 1 : currentSrc + 1;
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  // Synchronize the intense effect with image changes
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleIntenseEffect = () => {
      setIntense(true);

      const timeout = setTimeout(() => {
        setIntense(false);
      }, INTENSE_DURATION);

      return timeout;
    };

    // Initial effect
    const initialTimeout = handleIntenseEffect();

    // Setup interval for subsequent effects
    const interval = setInterval(() => {
      handleIntenseEffect();
    }, ROTATION_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [imagesLoaded]);

  if (!imagesLoaded) {
    return <div className="imageGlitch loading">Loading...</div>;
  }

  return (
    <div className={`imageGlitch ${intense ? "opacity-50" : "opacity-75"}`}>
      <GlitchCanvas src={src} intense={intense} />
    </div>
  );
}
