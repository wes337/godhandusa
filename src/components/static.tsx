/* eslint-disable no-var */
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "./static.css";

function interpolate(
  x: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
}

export default function Static() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const init = useRef(false);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (!init.current) {
      init.current = true;
      return;
    }

    setShow(true);

    const timeout = setTimeout(() => {
      setShow(false);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  useEffect(() => {
    const onShowStatic = () => {
      setShow(true);
    };

    const onHideStatic = () => {
      setShow(false);
    };

    document.addEventListener("showstatic", onShowStatic);
    document.addEventListener("hidestatic", onHideStatic);

    return () => {
      document.removeEventListener("showstatic", onShowStatic);
      document.removeEventListener("hidestatic", onShowStatic);
    };
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("static") as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    const context = (canvas.getContext("gl") ||
      canvas.getContext("2d")) as CanvasRenderingContext2D;
    const scaleFactor = 2.5;
    let samples: ImageData[] = [];
    let sampleIndex = 0;
    let scanOffsetY = 0;
    let scanSize = 0;
    const FPS = 60;
    const scanSpeed = FPS * 3;
    const SAMPLE_COUNT = 10;

    const onResize = () => {
      canvas.width = canvas.offsetWidth / scaleFactor;
      canvas.height = canvas.width / (canvas.offsetWidth / canvas.offsetHeight);
      scanSize = canvas.offsetHeight / scaleFactor / 3;
      samples = [];

      for (var i = 0; i < SAMPLE_COUNT; i++)
        samples.push(
          generateRandomSample(context, canvas.width, canvas.height)
        );
    };

    const generateRandomSample = (
      context: CanvasRenderingContext2D,
      w: number,
      h: number
    ) => {
      const intensity: any[] = [];
      const factor = h / 50;
      const trans = 1 - Math.random() * 0.05;
      const intensityCurve: any[] = [];

      for (var i = 0; i < Math.floor(h / factor) + factor; i++) {
        intensityCurve.push(Math.floor(Math.random() * 15));
      }

      for (var i = 0; i < h; i++) {
        var value = interpolate(
          i / factor,
          Math.floor(i / factor),
          intensityCurve[Math.floor(i / factor)],
          Math.floor(i / factor) + 1,
          intensityCurve[Math.floor(i / factor) + 1]
        );

        intensity.push(value);
      }

      var imageData = context.createImageData(w, h);

      for (var i = 0; i < w * h; i++) {
        var k = i * 4;
        var color = Math.floor(36 * Math.random());

        color += intensity[Math.floor(i / w)];
        imageData.data[k] =
          imageData.data[k + 1] =
          imageData.data[k + 2] =
            color;
        imageData.data[k + 3] = Math.round(255 * trans);
      }

      return imageData;
    };

    const render = () => {
      context.putImageData(samples[Math.floor(sampleIndex)], 0, 0);

      sampleIndex += 20 / FPS; // 1/FPS == 1 second
      if (sampleIndex >= samples.length) sampleIndex = 0;

      var grd = context.createLinearGradient(
        0,
        scanOffsetY,
        0,
        scanSize + scanOffsetY
      );

      grd.addColorStop(0, "rgba(255,255,255,0)");
      grd.addColorStop(0.1, "rgba(255,255,255,0)");
      grd.addColorStop(0.2, "rgba(255,255,255,0.2)");
      grd.addColorStop(0.3, "rgba(255,255,255,0.0)");
      grd.addColorStop(0.45, "rgba(255,255,255,0.1)");
      grd.addColorStop(0.5, "rgba(255,255,255,1.0)");
      grd.addColorStop(0.55, "rgba(255,255,255,0.55)");
      grd.addColorStop(0.6, "rgba(255,255,255,0.25)");
      grd.addColorStop(0.8, "rgba(255,255,255,0.15)");
      grd.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = grd;
      context.fillRect(0, scanOffsetY, canvas.width, scanSize + scanOffsetY);
      context.globalCompositeOperation = "lighter";

      scanOffsetY += canvas.height / scanSpeed;
      if (scanOffsetY > canvas.height) scanOffsetY = -(scanSize / 2);

      requestAnimationFrame(render);
    };

    onResize();

    window.addEventListener("resize", onResize);
    const animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={`static${show ? " show" : ""}`}>
      <canvas id="static" />
    </div>
  );
}
