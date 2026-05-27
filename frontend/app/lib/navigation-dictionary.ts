import { type Locale } from "@/i18n.config";
import { type SectionId } from "../store/navigationStore";

export const navigationLabels = {
  es: {
    inicio: "Inicio",
    manifiesto: "Manifiesto", 
    trabajos: "Trabajos",
    algunaIdea: "¿Alguna idea?",
    cursos: "Cursos",
    sobreMi: "Sobre Mí",
    tienda: "Tienda",
    contacto: "Contacta",
    footer: "Footer",
    postFooter: "Post Footer",
    language: "EN/ES",
    blog: "Mi Blog",
  },
  en: {
    inicio: "Home",
    manifiesto: "Manifesto",
    trabajos: "Work", 
    algunaIdea: "Got an idea?",
    cursos: "Courses",
    sobreMi: "About Me",
    tienda: "Shop", 
    contacto: "Contact",
    footer: "Footer",
    postFooter: "Post Footer",
    language: "ES/EN",
    blog: "My Blog",
  }
} as const;

export function getNavigationLabel(sectionId: SectionId | "language" | "blog", locale: Locale): string {
  return navigationLabels[locale]?.[sectionId] || navigationLabels.es[sectionId];
}