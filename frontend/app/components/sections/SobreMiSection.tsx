"use client";
import Button from "../Button";
import { useLocaleStore } from "@/app/store/localeStore";

interface SobreMiSectionData {
  _type: "SobreMiSection";
  title?: string;
  body?: string;
  verMasUrl?: string;
}

interface SobreMiSectionProps {
  data?: SobreMiSectionData;
  mobile?: boolean;
}

const DEFAULT_TITLE = "SOBRE PIPO";
const DEFAULT_BODY = `Pipo no es una fábrica. Es una forma de pensar con las manos.
Detrás del nombre hay un taller en Gran Canaria, un muñeco de madera con carácter, y Antonio, el experto que lleva años transformando materiales descartados y nuevos en piezas únicas y con alma.

El nombre "Pipo" viene de un apodo familiar del abuelo de Antonio. Por la zona les conocían como Los Pipotes, y este proyecto es también un guiño a ese legado que nunca se perdió del todo... ¡Ni se perderá!

Cuando mi creador Antonio le contó la idea al equipo de FUGU CGCA, se empeñaron en que mi personalidad y mi pinta fueran tal cual soy ahora. ¡Y menos mal! Me podrían haber hecho mucho más feo… o peor, ¡mucho más aburrido!

Aquí no se hacen muebles de catálogo. Se crean objetos únicos, pensados desde el material, desde la historia y desde lo que pide cada espacio.

Porque en Pipo, lo único es lo normal.`;

const FUGU_KEYWORD = "FUGU CGCA";
const FUGU_URL = "https://www.byfugu.com/";

function renderWithFuguLink(text: string) {
  const idx = text.indexOf(FUGU_KEYWORD);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={FUGU_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold underline"
      >
        {FUGU_KEYWORD}
      </a>
      {text.slice(idx + FUGU_KEYWORD.length)}
    </>
  );
}

export default function SobreMiSection({ data, mobile = false }: SobreMiSectionProps) {
  const locale = useLocaleStore((s) => s.locale);
  const title = data?.title ?? DEFAULT_TITLE;
  const body = data?.body ?? DEFAULT_BODY;
  const verMasUrl = data?.verMasUrl ?? `/${locale}/carpinteria-artesanal-gran-canaria`;

  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  const bodyParagraphs = paragraphs.slice(0, -1);
  const lastParagraph = paragraphs[paragraphs.length - 1];

  return (
    <section
      id="sobreMi"
      className="w-10/12 h-full flex flex-col items-center justify-center mx-auto gap-3"
      style={{ paddingTop: mobile ? "5vh" : "16px", paddingBottom: mobile ? "5vh" : 0, paddingLeft: "16px", paddingRight: "16px" }}
    >
      <p
        className={`font-sans font-bold leading-none tracking-normal text-center text-green-pipo flex-shrink-0 ${mobile ? "text-3xl" : "text-5xl"}`}
      >
        {title}
      </p>

      <div
        className="flex flex-col gap-2 text-center text-green-pipo font-sans leading-snug w-full"
        style={{
          background: "rgba(228, 229, 224, 0.7)",
          padding: "10px",
          borderRadius: "6px",
          fontSize: mobile ? 15 : 11,
        }}
      >
        {bodyParagraphs.map((p, i) => (
          <p key={i}>{renderWithFuguLink(p)}</p>
        ))}
        {lastParagraph && <p className="font-bold">{lastParagraph}</p>}
      </div>

      {verMasUrl ? (
        <Button as="link" href={verMasUrl} variant="primary" size="sm" className="!text-[10px] !py-[5px] !px-[7px]">
          {locale === "es" ? "Ver más" : "Read more"}
        </Button>
      ) : null}
    </section>
  );
}
