import { create } from "zustand";

// Definir las secciones disponibles
export type SectionId =
  | "inicio"
  | "manifiesto"
  | "algunaIdea"
  | "trabajos"
  | "cursos"
  | "tienda"
  | "contacto";

// Configuración de secciones
export interface Section {
  id: SectionId;
  label: string;
  element?: HTMLElement | null;
}

// Estado del store
interface NavigationState {
  // Sección actual activa
  currentSection: SectionId | null;

  // Flag para bloquear el observer durante scroll programático
  isScrolling: boolean;

  // Todas las secciones disponibles
  sections: Section[];

  // Acciones
  setCurrentSection: (sectionId: SectionId) => void;
  scrollToSection: (sectionId: SectionId) => void;
  registerSection: (sectionId: SectionId, element: HTMLElement) => void;
  initializeSections: () => void;
}

// Store de navegación
export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentSection: "inicio",
  isScrolling: false,

  sections: [
    { id: "inicio", label: "Inicio" },
    { id: "manifiesto", label: "Manifiesto" },
    { id: "trabajos", label: "Trabajos" },
    { id: "algunaIdea", label: "¿Alguna idea?" },
    { id: "cursos", label: "Cursos" },
    { id: "tienda", label: "Tienda" },
    { id: "contacto", label: "Contacta" },
  ],

  setCurrentSection: (sectionId: SectionId) => {
    set({ currentSection: sectionId });
  },

  scrollToSection: (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Bloquear el observer durante el scroll
      set({ isScrolling: true, currentSection: sectionId });

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Desbloquear el observer después del scroll
      setTimeout(() => {
        set({ isScrolling: false });
      }, 1000); // 1 segundo debería ser suficiente para el scroll
    }
  },

  registerSection: (sectionId: SectionId, element: HTMLElement) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, element } : section
      ),
    }));
  },


  initializeSections: () => {
    const { sections } = get();

    // Registrar todos los elementos DOM
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        get().registerSection(section.id, element);
      }
    });

    // Detectar sección actual basada en scroll
    const observer = new IntersectionObserver(
      (entries) => {
        // No actualizar si estamos en medio de un scroll programático
        if (get().isScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const sectionId = entry.target.id as SectionId;
            get().setCurrentSection(sectionId);
          }
        });

        // Si no hay ninguna sección visible, limpiar el estado
        const anyVisible = entries.some((entry) => entry.isIntersecting);
        if (!anyVisible) {
          get().setCurrentSection(null);
        }
      },
      {
        threshold: 0.5, // 50% del elemento visible
      }
    );

    // Observar todas las secciones
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });
  },
}));
