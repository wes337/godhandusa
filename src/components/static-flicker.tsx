"use client";

import { useEffect } from "react";
import { randomNumberBetween } from "@/utils";

export default function StaticFlicker() {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const flicker = () => {
      document.dispatchEvent(new Event("showstatic"));

      timeout = setTimeout(() => {
        document.dispatchEvent(new Event("hidestatic"));
        timeout = setTimeout(flicker, randomNumberBetween(1000, 5000));
      }, randomNumberBetween(50, 300));
    };

    timeout = setTimeout(flicker, randomNumberBetween(500, 2000));

    return () => {
      clearTimeout(timeout);
      document.dispatchEvent(new Event("hidestatic"));
    };
  }, []);

  return null;
}
