"use client";

import Image from "next/image";
import type { SectionsData } from "./Shelves";
import InicioSection from "./sections/InicioSection";
import PlaygroundSection from "./sections/PlaygroundSection";
import ManifiestoSection from "./sections/ManifiestoSection";
import TrabajosMobile from "./sections/TrabajosMobile";
import AlgunaIdeaSection from "./sections/AlgunaIdeaSection";
import CursosSection from "./sections/CursosSection";
import SobreMiSection from "./sections/SobreMiSection";
import TiendaSection from "./sections/TiendaSection";
import ContactoSection from "./sections/ContactoSection";
import Footer from "./sections/Footer";

export default function MobileLayout({
  sectionsData,
}: {
  sectionsData: SectionsData;
}) {
  return (
    <div style={{ overflowX: "hidden" }}>
      {/* INICIO */}
      <section id="inicio" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-01.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-10">
          <InicioSection data={sectionsData.inicio} mobile />
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
        <div className="absolute inset-0 z-10">
          <ManifiestoSection data={sectionsData.manifiesto} />
        </div>
      </section>

      {/* TRABAJOS */}
      <section id="trabajos" className="relative w-full h-screen overflow-hidden">
        <Image
          src="/images/mobile/bg-mobile-03.webp"
          alt=""
          fill
          className="object-cover"
        />
        <TrabajosMobile data={sectionsData.trabajos} />
      </section>

      {/* ALGUNA IDEA */}
      <section id="algunaIdea" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-04.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 z-10">
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
        <div className="absolute inset-0 z-10">
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
        <div className="absolute inset-0 z-10">
          <SobreMiSection data={sectionsData.sobreMi} mobile />
        </div>
      </section>

      {/* TIENDA */}
      <section id="tienda" className="relative w-full h-screen overflow-hidden">
        <Image
          src="/images/mobile/bg-mobile-07.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 z-10">
          <TiendaSection data={sectionsData.tienda} products={sectionsData.products} mobile />
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-08.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 z-10">
          <ContactoSection data={sectionsData.contacto} mobile />
        </div>
      </section>

      {/* FOOTER */}
      <section id="footer" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-09.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 z-10">
          <Footer data={sectionsData.footer} mobile />
        </div>
      </section>

      <PlaygroundSection data={sectionsData.postFooter} />
    </div>
  );
}
