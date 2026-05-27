"use client";

import Image from "next/image";
import type { SectionsData } from "./Shelves";
import InicioSection from "./sections/InicioSection";
import PlaygroundSection from "./sections/PlaygroundSection";
import ManifiestoSection from "./sections/ManifiestoSection";

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
      </section>

      {/* ALGUNA IDEA */}
      <section id="algunaIdea" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-04.webp"
          alt=""
          fill
          className="object-cover"
        />
      </section>

      {/* CURSOS */}
      <section id="cursos" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-05.webp"
          alt=""
          fill
          className="object-cover"
        />
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
