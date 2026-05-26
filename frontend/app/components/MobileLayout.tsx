"use client";

import Image from "next/image";
import type { SectionsData } from "./Shelves";
import InicioSection from "./sections/InicioSection";
import PlaygroundSection from "./sections/PlaygroundSection";

const BG_SECTIONS = [
  { id: "manifiesto", bg: "/images/mobile/bg-mobile-02.webp" },
  { id: "trabajos", bg: "/images/mobile/bg-mobile-03.webp" },
  { id: "algunaIdea", bg: "/images/mobile/bg-mobile-04.webp" },
  { id: "cursos", bg: "/images/mobile/bg-mobile-05.webp" },
  { id: "sobreMi", bg: "/images/mobile/bg-mobile-06.webp" },
  { id: "tienda", bg: "/images/mobile/bg-mobile-07.webp" },
  { id: "contacto", bg: "/images/mobile/bg-mobile-08.webp" },
  { id: "footer", bg: "/images/mobile/bg-mobile-09.webp" },
];

export default function MobileLayout({
  sectionsData,
}: {
  sectionsData: SectionsData;
}) {
  return (
    <div>
      <section id="inicio" className="relative w-full h-screen">
        <Image
          src="/images/mobile/bg-mobile-01.webp"
          alt=""
          fill
          className="object-cover sm:object-contain"
          priority
        />
        <div className="relative z-10 h-full">
          <InicioSection data={sectionsData.inicio} />
        </div>
      </section>

      {BG_SECTIONS.map(({ id, bg }, i) => (
        <section key={id} id={id} className="relative w-full h-screen">
          <Image
            src={bg}
            alt=""
            fill
            className="object-cover sm:object-contain"
            priority={i < 1}
          />
        </section>
      ))}

      <PlaygroundSection data={sectionsData.postFooter} />
    </div>
  );
}
