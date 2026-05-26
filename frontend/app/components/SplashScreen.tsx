"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigationStore } from "../store/navigationStore";

const MIN_MS = 1500;

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
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const mountTime = useRef(Date.now());
  const exitedRef = useRef(false);

  const exit = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    const wait = Math.max(0, MIN_MS - (Date.now() - mountTime.current));
    setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 700);
    }, wait);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mobile = window.innerWidth < 768;

    if (mobile) {
      // Precargar imágenes de fondo y trackear progreso real
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
        img.onerror = onSettle; // contar errores para no bloquearse
        img.src = src;
      });
    } else {
      // Desktop: fake progress mientras carga el GLB
      let p = 0;
      const id = setInterval(() => {
        p = Math.min(p + 1.2, 90);
        setProgress(p);
        if (p >= 90) clearInterval(id);
      }, 20);
      return () => clearInterval(id);
    }
  }, [exit]);

  // Desktop: salir cuando el modelo 3D está en escena
  useEffect(() => {
    if (isModelReady) {
      setProgress(100);
      const id = setTimeout(exit, 150); // pequeña pausa para que se vea el 100%
      return () => clearTimeout(id);
    }
  }, [isModelReady, exit]);

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
        src="/videos/LoopPipoIntro_165%25_v2.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-48"
        onEnded={(e) => {
          e.currentTarget.currentTime = 0;
          e.currentTarget.play().catch(() => {});
        }}
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
