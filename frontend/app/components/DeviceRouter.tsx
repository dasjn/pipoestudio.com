"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import MobileLayout from "./MobileLayout";
import type { SectionsData } from "./Shelves";

const ThreeDCanvas = dynamic(() => import("./ThreeDCanvas"), { ssr: false });

export default function DeviceRouter({
  sectionsData,
}: {
  sectionsData: SectionsData;
}) {
  const isMobile = useIsMobile(768);

  if (isMobile) return <MobileLayout sectionsData={sectionsData} />;
  return <ThreeDCanvas sectionsData={sectionsData} />;
}
