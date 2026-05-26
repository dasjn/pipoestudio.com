"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MobileLayout from "./MobileLayout";
import InicioSection from "./sections/InicioSection";
import PlaygroundSection from "./sections/PlaygroundSection";
import type { SectionsData } from "./Shelves";

const ThreeDCanvas = dynamic(() => import("./ThreeDCanvas"), { ssr: false });

export default function DeviceRouter({
  sectionsData,
}: {
  sectionsData: SectionsData;
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(check, 400);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
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
