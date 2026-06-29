"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import WorkGalleryLightbox, {
  type GalleryImage,
} from "@/app/components/WorkGalleryLightbox";

interface FotoItem {
  url?: string;
  nombre?: string;
  descripcion?: string;
  galeria?: GalleryImage[];
}

interface TrabajosMobileData {
  statement?: string;
  fotos?: FotoItem[];
}

export default function TrabajosMobile({ data }: { data?: TrabajosMobileData }) {
  const [openFoto, setOpenFoto] = useState<FotoItem | null>(null);
  const fotos = data?.fotos ?? [];

  return (
    <>
      <div className="absolute inset-0 z-10 flex flex-col justify-center gap-6 items-center overflow-hidden">
        <p className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-green-pipo px-12">
          {data?.statement || "PROYECTOS QUE HABLAN POR SÍ SOLOS."}
        </p>
        <div
          style={{
            width: "100%",
            height: "55vh",
            display: "flex",
            overflowX: "auto",
            gap: 12,
            paddingLeft: "calc((100% - 55vw) / 2)",
            paddingRight: "calc((100% - 55vw) / 2)",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {fotos.map((foto, i) => {
            const galeria = foto.galeria ?? [];
            const hasGallery = galeria.length > 0;
            return (
              <div
                key={i}
                onClick={hasGallery ? () => setOpenFoto(foto) : undefined}
                role={hasGallery ? "button" : undefined}
                aria-label={
                  hasGallery && foto.nombre
                    ? `Ver galería de ${foto.nombre}`
                    : undefined
                }
                style={{
                  flexShrink: 0,
                  width: "55vw",
                  height: "55vh",
                  scrollSnapAlign: "center",
                  scrollSnapStop: "always",
                  borderRadius: 6,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  cursor: hasGallery ? "pointer" : "default",
                }}
              >
                <div className="bg-green-pipo text-white font-sans text-center py-2 px-2 flex-shrink-0 flex flex-col gap-0.5">
                  <span className="font-bold uppercase text-sm">
                    {foto.nombre || "—"}
                  </span>
                  {foto.descripcion && (
                    <span className="text-xs opacity-90">{foto.descripcion}</span>
                  )}
                </div>
                <div className="flex-1 relative min-h-0">
                  {foto.url ? (
                    <Image
                      src={foto.url}
                      alt={foto.nombre ?? ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2a2a2a]" />
                  )}

                  {hasGallery && (
                    <div
                      className="font-sans"
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 9px",
                        borderRadius: 99,
                        background: "rgba(0,0,0,0.55)",
                        color: "white",
                        fontSize: 12,
                        lineHeight: 1,
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 15 }}
                        aria-hidden="true"
                      >
                        photo_library
                      </span>
                      {galeria.length}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {openFoto && (openFoto.galeria?.length ?? 0) > 0 && (
          <WorkGalleryLightbox
            images={openFoto.galeria!}
            title={openFoto.nombre}
            onClose={() => setOpenFoto(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
