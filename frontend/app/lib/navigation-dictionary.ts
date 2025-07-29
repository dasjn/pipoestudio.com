import { type Locale } from "@/i18n.config";
import { type SectionId } from "../store/navigationStore";

export const navigationLabels = {
  es: {
    inicio: "Inicio",
    manifiesto: "Manifiesto", 
    trabajos: "Trabajos",
    algunaIdea: "¿Alguna idea?",
    cursos: "Cursos",
    tienda: "Tienda",
    contacto: "Contacta",
    language: "EN/ES"
  },
  en: {
    inicio: "Home",
    manifiesto: "Manifesto",
    trabajos: "Work", 
    algunaIdea: "Got an idea?",
    cursos: "Courses",
    tienda: "Shop", 
    contacto: "Contact",
    language: "ES/EN"
  }
} as const;

export function getNavigationLabel(sectionId: SectionId | "language", locale: Locale): string {
  return navigationLabels[locale]?.[sectionId] || navigationLabels.es[sectionId];
}