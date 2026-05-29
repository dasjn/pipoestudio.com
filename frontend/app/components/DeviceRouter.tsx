"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MobileLayout from "./MobileLayout";
import InicioSection from "./sections/InicioSection";
import PlaygroundSection from "./sections/PlaygroundSection";
import type { SectionsData } from "./Shelves";
import { useNavigationStore } from "../store/navigationStore";

const ThreeDCanvas = dynamic(() => import("./ThreeDCanvas"), { ssr: false });

export default function DeviceRouter({
  sectionsData,
}: {
  sectionsData: SectionsData;
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const setModelReady = useNavigationStore((s) => s.setModelReady);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    if (mq.matches) setModelReady();
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) return <MobileLayout sectionsData={sectionsData} />;

  return (
    <>
      <InicioSection data={sectionsData.inicio} />
      <PlaygroundSection data={sectionsData.postFooter} />
      <ThreeDCanvas sectionsData={sectionsData} />
    </>
  );
}
