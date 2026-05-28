"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigationStore } from "../store/navigationStore";

const MIN_MS = 1500;

// Variable de módulo: false en hard reload, true tras mostrar el splash una vez.
// No se resetea en navegación SPA (blog→home), sí en Ctrl+R o nueva pestaña.
let splashHasShown = false;

const MOBILE_IMAGES = [
  "/images/mobile/bg-mobile-01.webp",
  "/images/mobile/bg-mobile-02.webp",
  "/images/mobile/bg-mobile-03.webp",
  "/images/mobile/bg-mobile-04.webp",
  "/images/mobile/bg-mobile-05.webp",
  "/images/mobile/bg-mobile-06.webp",
  "/images/mobile/bg-mobile-07.webp",
  "/images/mobile/bg-mobile-08.webp",
  "/images/mobile/bg-mobile-09.webp",
];

export default function SplashScreen() {
  const isModelReady = useNavigationStore((s) => s.isModelReady);
  const [visible, setVisible] = useState(!splashHasShown);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const mountTime = useRef(Date.now());
  const exitedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const exit = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(100);
    const wait = Math.max(0, MIN_MS - (Date.now() - mountTime.current));
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        splashHasShown = true;
        setVisible(false);
      }, 700);
    }, wait);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const mobile = window.innerWidth < 768;

    if (mobile) {
      let loaded = 0;
      const total = MOBILE_IMAGES.length;
      const onSettle = () => {
        loaded++;
        setProgress(Math.round((loaded / total) * 100));
        if (loaded === total) exit();
      };
      MOBILE_IMAGES.forEach((src) => {
        const img = new window.Image();
        img.onload = onSettle;
        img.onerror = onSettle;
        img.src = src;
      });
    } else {
      let p = 0;
      intervalRef.current = setInterval(() => {
        p = Math.min(p + 1.2, 90);
        setProgress(p);
        if (p >= 90) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }, 20);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [visible, exit]);

  useEffect(() => {
    if (isModelReady && visible) exit();
  }, [isModelReady, visible, exit]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6"
      style={{
        backgroundColor: "#00A750",
        opacity: fading ? 0 : 1,
        transition: "opacity 700ms ease-out",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <video
        src="/videos/LoopPipoIntro_165%25_v2_fs.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-48"
      />
      <div className="w-48 h-[3px] rounded-full overflow-hidden bg-white/30">
        <div
          className="h-full bg-white rounded-full"
          style={{
            width: `${progress}%`,
            transition: "width 150ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
