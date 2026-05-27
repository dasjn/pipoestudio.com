"use client";

import Image from "next/image";
import type { SectionsData } from "./Shelves";
import InicioSection from "./sections/InicioSection";
import PlaygroundSection from "./sections/PlaygroundSection";
import ManifiestoSection from "./sections/ManifiestoSection";
import AlgunaIdeaSection from "./sections/AlgunaIdeaSection";
import CursosSection from "./sections/CursosSection";

export default function MobileLayout({
  sectionsData,
}: {
  sectionsData: SectionsData;
}) {
  return (
    <div>
      {/* INICIO */}
      <section id="inicio" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-01.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 h-full">
          <InicioSection data={sectionsData.inicio} />
        </div>
      </section>

      {/* MANIFIESTO */}
      <section id="manifiesto" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-02.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="relative z-10 h-full">
          <ManifiestoSection data={sectionsData.manifiesto} />
        </div>
      </section>

      {/* TRABAJOS */}
      <section id="trabajos" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-03.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="relative z-10 h-full flex flex-col justify-center gap-6 items-center">
          <p className="font-sans font-bold text-3xl leading-none tracking-normal text-center text-green-pipo px-12">
            {sectionsData.trabajos?.statement || "PROYECTOS QUE HABLAN POR SÍ SOLOS."}
          </p>
          <div
            className="w-full"
            style={{ height: "55vh" }}
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 12,
              paddingLeft: "calc((100% - 55vw) / 2)",
              paddingRight: "calc((100% - 55vw) / 2)",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
            }}
          >
            {(sectionsData.trabajos?.fotos ?? []).map(
              (foto: { url?: string; nombre?: string; descripcion?: string }, i: number) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: "55vw",
                    height: "55vh",
                    scrollSnapAlign: "center",
                    borderRadius: 6,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="bg-green-pipo text-white font-sans text-center py-2 px-2 flex-shrink-0 flex flex-col gap-0.5">
                    <span className="font-bold uppercase text-xs">{foto.nombre || "—"}</span>
                    {foto.descripcion && (
                      <span className="text-[10px] opacity-90">{foto.descripcion}</span>
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
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ALGUNA IDEA */}
      <section id="algunaIdea" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-04.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="relative z-10 h-full">
          <AlgunaIdeaSection data={sectionsData.algunaIdea} mobile />
        </div>
      </section>

      {/* CURSOS */}
      <section id="cursos" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-05.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="relative z-10 h-full">
          <CursosSection data={sectionsData.cursos} mobile />
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section id="sobreMi" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-06.webp"
          alt=""
          fill
          className="object-cover"
        />
      </section>

      {/* TIENDA */}
      <section id="tienda" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-07.webp"
          alt=""
          fill
          className="object-cover"
        />
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-08.webp"
          alt=""
          fill
          className="object-cover"
        />
      </section>

      {/* FOOTER */}
      <section id="footer" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-09.webp"
          alt=""
          fill
          className="object-cover"
        />
      </section>

      <PlaygroundSection data={sectionsData.postFooter} />
    </div>
  );
}
