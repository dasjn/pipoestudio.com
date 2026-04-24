import {
  InicioSection,
  ManifiestoSection,
  TrabajosSection,
  AlgunaIdeaSection,
  CursosSection,
  TiendaSection,
  ContactoSection,
} from "./sections";
import SobreMiSection from "./sections/SobreMiSection";

interface Section {
  _type: string;
  _key: string;
  [key: string]: any;
}

interface SectionRendererProps {
  sections: Section[];
  posts?: any[];
}

export default function SectionRenderer({
  sections,
  posts = [],
}: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        const key = section._key || `${section._type}-${index}`;

        switch (section._type) {
          case "inicioSection":
            return <InicioSection key={key} data={section as any} />;
          case "manifiestoSection":
            return <ManifiestoSection key={key} data={section as any} />;
          case "trabajosSection":
            return <TrabajosSection key={key} data={section as any} />;
          case "algunaIdeaSection":
            return <AlgunaIdeaSection key={key} data={section as any} />;
          case "cursosSection":
            return <CursosSection key={key} data={section as any} />;
          case "sobreMiSection":
            return <SobreMiSection key={key} data={section as any} />;
          case "tiendaSection":
            return <TiendaSection key={key} data={section as any} />;
          case "contactoSection":
            return <ContactoSection key={key} data={section as any} />;
          default:
            console.warn(`Unknown section type: ${section._type}`);
            return null;
        }
      })}
    </>
  );
}
