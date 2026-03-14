"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigationStore, type SectionId } from "../store/navigationStore";
import ManifiestoSection from "./sections/ManifiestoSection";
import TrabajosSection from "./sections/TrabajosSection";
import AlgunaIdeaSection from "./sections/AlgunaIdeaSection";
import CursosSection from "./sections/CursosSection";
import SobreMiSection from "./sections/SobreMiSection";
import TiendaSection from "./sections/TiendaSection";
import ContactoSection from "./sections/ContactoSection";
import FooterSection from "./sections/Footer";
import { type SectionsData } from "./Shelves";

// ─── Constantes world-space ───────────────────────────────────────────────────
// PLANE_W calibrado visualmente al ancho interior del slot del mueble.
// Subir si el contenido no llega a los bordes; bajar si se sale.
const PLANE_W = 4.6;
const PLANE_H = 1.889;

// Tamaño de referencia al que están diseñadas las secciones (px)
const REF_W = 600;
const REF_H = Math.round(REF_W * (PLANE_H / PLANE_W)); // ~246px

// Geometría de cámara fija para todas las secciones del mueble
const CAMERA_Z = 15;
const SLOT_Z = 3.468;
const DISTANCE = CAMERA_Z - SLOT_Z; // 11.532 world units

// Posiciones Y world-space de cada slot (del mesh anchor en Shelves.tsx)
const SLOT_Y: Partial<Record<SectionId, number>> = {
  manifiesto: 0.666,
  trabajos: -2.645,
  algunaIdea: -5.983,
  cursos: -9.318,
  sobreMi: -12.651,
  tienda: -15.993,
  contacto: -19.333,
  footer: -22.673,
};

// ─── FOV dinámico (misma lógica que ThreeDCanvas) ────────────────────────────

function getDynamicFov(baseFov: number, vw: number): number {
  if (vw < 768) return baseFov * 2.8;
  if (vw < 1024) return baseFov * 2.4;
  if (vw < 1440) return baseFov * 2;
  return baseFov;
}

// ─── Layout del slot ─────────────────────────────────────────────────────────

interface SlotLayout {
  slotWidthPx: number;
  slotHeightPx: number;
  scale: number;
  visibleWidth: number;
  visibleHeight: number;
  vw: number;
  vh: number;
}

function useSlotLayout(): SlotLayout | null {
  const [layout, setLayout] = useState<SlotLayout | null>(null);

  const compute = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fov = getDynamicFov(20, vw);
    const fovRad = (fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(fovRad / 2) * DISTANCE;
    const visibleWidth = visibleHeight * (vw / vh);
    const slotWidthPx = (PLANE_W / visibleWidth) * vw;
    const slotHeightPx = (PLANE_H / visibleHeight) * vh;
    const scale = slotWidthPx / REF_W;
    setLayout({ slotWidthPx, slotHeightPx, scale, visibleWidth, visibleHeight, vw, vh });
  }, []);

  useEffect(() => {
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [compute]);

  return layout;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function SectionOverlays({
  sectionsData,
}: {
  sectionsData?: SectionsData;
}) {
  const { currentSection, isTransitioning, sections } = useNavigationStore();
  const layout = useSlotLayout();

  if (!layout) return null;

  const sectionSlots: {
    id: SectionId;
    content: React.ReactNode;
    planeH?: number;
    planeW?: number;
  }[] = [
    {
      id: "manifiesto",
      content: <ManifiestoSection data={sectionsData?.manifiesto} />,
    },
    {
      id: "trabajos",
      content: <TrabajosSection data={sectionsData?.trabajos} />,
    },
    {
      id: "algunaIdea",
      content: <AlgunaIdeaSection data={sectionsData?.algunaIdea} />,
      planeH: 3.1,
      planeW: 6.5,
    },
    {
      id: "cursos",
      content: <CursosSection data={sectionsData?.cursos} />,
      planeH: 3.5,
    },
    {
      id: "sobreMi",
      content: <SobreMiSection data={sectionsData?.sobreMi} />,
      planeH: 2.5,
    },
    {
      id: "tienda",
      content: (
        <TiendaSection
          data={sectionsData?.tienda}
          products={sectionsData?.products}
        />
      ),
      planeH: 3.2,
    },
    {
      id: "contacto",
      content: <ContactoSection data={sectionsData?.contacto} />,
      planeH: 3.2,
      planeW: 6.5,
    },
    {
      id: "footer",
      content: <FooterSection />,
    },
  ];

  return (
    <>
      {sectionSlots.map(({ id, content, planeH: slotPlaneH, planeW: slotPlaneW }) => {
        const shouldShow = currentSection === id && !isTransitioning;

        // Per-slot overrides
        const effectivePlaneH = slotPlaneH ?? PLANE_H;
        const effectivePlaneW = slotPlaneW ?? PLANE_W;

        const slotWidthPx = (effectivePlaneW / layout.visibleWidth) * layout.vw;
        const slotHeightPx = (effectivePlaneH / layout.visibleHeight) * layout.vh;

        // refW scales with planeW so that layout.scale stays constant
        const refW = Math.round(REF_W * (effectivePlaneW / PLANE_W));
        const refH = Math.round(refW * (effectivePlaneH / effectivePlaneW));

        // Offset Y: el slot mesh está ligeramente por encima de la Y de cámara.
        const slotY = SLOT_Y[id] ?? 0;
        const cameraY =
          sections.find((s) => s.id === id)?.cameraPosition.position.y ?? slotY;
        const yOffsetPx =
          ((slotY - cameraY) / (layout.visibleHeight / 2)) * (layout.vh / 2);

        return (
          <div
            key={id}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              width: slotWidthPx,
              height: slotHeightPx,
              marginLeft: -slotWidthPx / 2,
              marginTop: -(slotHeightPx / 2) - yOffsetPx,
              overflow: "hidden",
              pointerEvents: shouldShow ? "auto" : "none",
            }}
          >
            <AnimatePresence>
              {shouldShow && (
                <motion.div
                  key="section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: refW,
                      height: refH,
                      transform: `translate(-50%, -50%) scale(${layout.scale})`,
                      transformOrigin: "center",
                    }}
                  >
                    {content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}
