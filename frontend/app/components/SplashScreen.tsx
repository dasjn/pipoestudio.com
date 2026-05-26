"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigationStore } from "../store/navigationStore";

const MIN_MS = 1500;

export default function SplashScreen() {
  const isModelReady = useNavigationStore((s) => s.isModelReady);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const mountTime = useRef(Date.now());
  const exitedRef = useRef(false);
  const fakeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const exit = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    if (fakeIntervalRef.current) clearInterval(fakeIntervalRef.current);
    const wait = Math.max(0, MIN_MS - (Date.now() - mountTime.current));
    setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 700);
    }, wait);
  }, []);

  // Fake progress for mobile (no 3D model loads)
  useEffect(() => {
    fakeIntervalRef.current = setInterval(() => {
      setFakeProgress((p) => (p < 90 ? p + 1.2 : p));
    }, 20);
    return () => {
      if (fakeIntervalRef.current) clearInterval(fakeIntervalRef.current);
    };
  }, []);

  // Desktop: exit when Model component has rendered (GLB parsed + in scene)
  useEffect(() => {
    if (isModelReady) exit();
  }, [isModelReady, exit]);

  // Mobile fallback: on mobile there's no 3D model, exit after MIN_MS
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    const id = setTimeout(exit, MIN_MS + 400);
    return () => clearTimeout(id);
  }, [exit]);

  const display = isModelReady ? 100 : fakeProgress;

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        backgroundColor: "#00A750",
        opacity: fading ? 0 : 1,
        transition: "opacity 700ms ease-out",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div className="w-48 h-[3px] rounded-full overflow-hidden bg-white/30">
        <div
          className="h-full bg-white rounded-full"
          style={{
            width: `${display}%`,
            transition: "width 150ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
