import { create } from "zustand";
import * as THREE from "three";

// Definir las secciones disponibles
export type SectionId =
  | "inicio"
  | "manifiesto"
  | "algunaIdea"
  | "trabajos"
  | "cursos"
  | "sobreMi"
  | "tienda"
  | "contacto"
  | "footer"
  | "postFooter";

// Configuración de posición de cámara
export interface CameraPosition {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  fov: number;
}

// Configuración de animaciones 3D para cada sección
export interface SectionAnimations {
  activeAnimations: string[];
}

// Configuración de secciones
export interface Section {
  id: SectionId;
  label: string;
  element?: HTMLElement | null;
  cameraPosition: CameraPosition;
  animations: SectionAnimations;
}

// Estado del store
interface NavigationState {
  // Sección actual activa
  currentSection: SectionId;

  // Flag para bloquear el observer durante scroll programático
  isScrolling: boolean;

  // Flag para bloquear scroll durante animaciones de cámara
  isTransitioning: boolean;

  // Todas las secciones disponibles
  sections: Section[];

  // Acciones
  setCurrentSection: (sectionId: SectionId) => void;
  scrollToSection: (sectionId: SectionId) => void;
  navigateToSection: (sectionId: SectionId) => void;
  registerSection: (sectionId: SectionId, element: HTMLElement) => void;
  initializeSections: () => void;
  setTransitioning: (transitioning: boolean) => void;
  getCurrentCameraPosition: () => CameraPosition | null;
  getCurrentAnimations: () => SectionAnimations | null;
  navigateNext: () => void;
  navigatePrevious: () => void;
}

// Store de navegación
export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentSection: "inicio",
  isScrolling: false,
  isTransitioning: false,

  sections: [
    {
      id: "inicio",
      label: "Inicio",
      cameraPosition: {
        position: { x: 0, y: 3.911, z: 13.5 },
        lookAt: { x: 0, y: 3.911, z: 3.468 },
        fov: 20,
      },
      animations: { activeAnimations: ["Idle"] },
    },
    {
      id: "manifiesto",
      label: "Manifiesto",
      cameraPosition: {
        position: { x: 0, y: 0.657, z: 15 },
        lookAt: { x: 0, y: 0.657, z: 3.468 },
        fov: 20,
      },
      animations: { activeAnimations: ["Action"] },
    },
    {
      id: "trabajos",
      label: "Trabajos",
      cameraPosition: {
        position: { x: 0, y: -2.677, z: 15 },
        lookAt: { x: 0, y: -2.677, z: 3.468 },
        fov: 20,
      },
      animations: { activeAnimations: ["Action.001"] },
    },
    {
      id: "algunaIdea",
      label: "¿Alguna idea?",
      cameraPosition: {
        position: { x: 0, y: -6.029, z: 15 },
        lookAt: { x: 0, y: -6.029, z: 3.468 },
        fov: 20,
      },
      animations: { activeAnimations: ["Action.002"] },
    },
    {
      id: "cursos",
      label: "Cursos",
      cameraPosition: {
        position: { x: 0, y: -9.373, z: 15 },
        lookAt: { x: 0, y: -9.373, z: 3.468 },
        fov: 20,
      },
      animations: { activeAnimations: ["Idle", "Action"] },
    },
    {
      id: "sobreMi",
      label: "Sobre Mi",
      cameraPosition: {
        position: { x: 0, y: -12.724, z: 15 },
        lookAt: { x: 0, y: -12.724, z: 3.468 },
        fov: 20,
      },
      animations: { activeAnimations: ["Action.001"] },
    },
    {
      id: "tienda",
      label: "Tienda",
      cameraPosition: {
        position: { x: 0, y: -16.078, z: 15 },
        lookAt: { x: 0, y: -16.078, z: 3.468 },
        fov: 20,
      },
      animations: { activeAnimations: ["Action.001", "Action.002"] },
    },
    {
      id: "contacto",
      label: "Contacta",
      cameraPosition: {
        position: { x: 0, y: -19.432, z: 15 },
        lookAt: { x: 0, y: -19.432, z: 3.468 },
        fov: 20,
      },
      animations: {
        activeAnimations: ["Idle", "Action", "Action.001", "Action.002"],
      },
    },
    {
      id: "footer",
      label: "Footer",
      cameraPosition: {
        position: { x: 0, y: -22.786, z: 15 },
        lookAt: { x: 0, y: -22.786, z: 3.468 },
        fov: 20,
      },
      animations: {
        activeAnimations: ["Idle", "Action", "Action.001", "Action.002"],
      },
    },
    {
      id: "postFooter",
      label: "Post Footer",
      cameraPosition: {
        position: { x: 0, y: -26.140, z: 15 },
        lookAt: { x: 0, y: -26.140, z: 3.468 },
        fov: 20,
      },
      animations: {
        activeAnimations: ["Idle"],
      },
    },
  ],

  setCurrentSection: (sectionId: SectionId) => {
    set({ currentSection: sectionId });
  },

  setTransitioning: (transitioning: boolean) => {
    set({ isTransitioning: transitioning });
  },

  getCurrentCameraPosition: () => {
    const { currentSection, sections } = get();
    const section = sections.find((s) => s.id === currentSection);
    return section?.cameraPosition || null;
  },

  getCurrentAnimations: () => {
    const { currentSection, sections } = get();
    const section = sections.find((s) => s.id === currentSection);
    return section?.animations || null;
  },

  navigateNext: () => {
    const { currentSection, sections, isTransitioning } = get();
    if (isTransitioning) return;

    const currentIndex = sections.findIndex((s) => s.id === currentSection);
    const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
    if (nextIndex !== currentIndex) {
      get().navigateToSection(sections[nextIndex].id);
    }
  },

  navigatePrevious: () => {
    const { currentSection, sections, isTransitioning } = get();
    if (isTransitioning) return;

    const currentIndex = sections.findIndex((s) => s.id === currentSection);
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex !== currentIndex) {
      get().navigateToSection(sections[prevIndex].id);
    }
  },

  navigateToSection: (sectionId: SectionId) => {
    const { isTransitioning } = get();
    if (isTransitioning) return;

    set({ isTransitioning: true, currentSection: sectionId });

    // Scroll to HTML section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // The transition will be unlocked when camera animation completes
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
        // No actualizar si estamos en medio de un scroll programático o transición
        if (get().isScrolling || get().isTransitioning) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const sectionId = entry.target.id as SectionId;
            get().setCurrentSection(sectionId);
          }
        });

        // Si no hay ninguna sección visible, mantener la sección actual
        // No limpiar el estado para evitar problemas de tipos
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
