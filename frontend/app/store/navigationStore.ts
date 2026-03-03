import { create } from "zustand";

// Definir las secciones disponibles
export type SectionId =
  | "inicio"
  | "manifiesto"
  | "trabajos"
  | "algunaIdea"
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

// Dirección de navegación
export type NavigationDirection = "down" | "up" | null;

// Tipos de idle disponibles
export type IdleState = "Idle 01" | "Idle 02" | "Idle 03" | "Idle 04";

// Configuración de transiciones por sección (al SALIR de esta sección)
// exitDown: idle destino al salir bajando (null = mantener idle actual)
// exitUp: idle destino al salir subiendo (null = mantener idle actual)
interface SectionTransitionConfig {
  exitDown: IdleState | null;
  exitUp: IdleState | null;
}

const sectionTransitions: Record<SectionId, SectionTransitionConfig> = {
  inicio: { exitDown: "Idle 02", exitUp: null }, // Salir bajando → Idle 02
  manifiesto: { exitDown: "Idle 02", exitUp: "Idle 01" }, // Salir bajando → Idle 02, subiendo → Idle 01
  trabajos: { exitDown: "Idle 02", exitUp: "Idle 01" }, // Salir bajando → Idle 02, subiendo → Idle 01
  algunaIdea: { exitDown: "Idle 03", exitUp: "Idle 01" }, // Punto de transición principal
  cursos: { exitDown: "Idle 03", exitUp: "Idle 02" }, // Sin transiciones (zona Idle 03)
  sobreMi: { exitDown: "Idle 04", exitUp: "Idle 02" }, // Solo al subir → Idle 02
  tienda: { exitDown: "Idle 04", exitUp: "Idle 03" }, // Sin transiciones
  contacto: { exitDown: "Idle 04", exitUp: "Idle 03" }, // Sin transiciones
  footer: { exitDown: null, exitUp: null }, // Sin transiciones
  postFooter: { exitDown: null, exitUp: null }, // Sin transiciones
};

// Animaciones de transición entre idles
// Clave: "fromIdle->toIdle"
// NOTA: Los nombres deben coincidir EXACTAMENTE con los del modelo GLB
const transitionAnimations: Record<string, string> = {
  "Idle 01->Idle 02": "Scroll 01-D",
  "Idle 02->Idle 03": "Scroll 02 - D",
  "Idle 03->Idle 04": "Scroll 03 - D",
  "Idle 02->Idle 01": "Scroll 03 - U",
  "Idle 03->Idle 02": "Scroll 02- U",
  "Idle 04->Idle 03": "Scroll 01- U",
};

// Cola de animaciones pendientes
interface QueuedAnimation {
  animation: string;
  targetIdle: IdleState;
}

// Configuración de animaciones (para loop settings)
// NOTA: Los nombres deben coincidir EXACTAMENTE con los del modelo GLB
const animationSettings: Record<
  string,
  { loop: boolean; clampWhenFinished: boolean }
> = {
  "Idle 01": { loop: true, clampWhenFinished: false },
  "Idle 02": { loop: true, clampWhenFinished: false },
  "Idle 03": { loop: true, clampWhenFinished: false },
  "Idle 04": { loop: true, clampWhenFinished: false },
  "Scroll 01-D": { loop: false, clampWhenFinished: true },
  "Scroll 01- U": { loop: false, clampWhenFinished: true },
  "Scroll 02 - D": { loop: false, clampWhenFinished: true },
  "Scroll 02- U": { loop: false, clampWhenFinished: true },
  "Scroll 03 - D": { loop: false, clampWhenFinished: true },
  "Scroll 03 - U": { loop: false, clampWhenFinished: true },
};

// Configuración simplificada de secciones (solo cámara)
export interface SectionConfig {
  id: SectionId;
  label: string;
  cameraPosition: CameraPosition;
}

// Configuración de secciones
export interface Section {
  id: SectionId;
  label: string;
  element?: HTMLElement | null;
  cameraPosition: CameraPosition;
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

  // Estado de la secuencia de animación
  isAnimationSequenceActive: boolean;

  // Dirección de navegación actual
  navigationDirection: NavigationDirection;

  // Idle actual (estado de la máquina de estados)
  currentIdle: IdleState;

  // Animación activa actual (para el componente 3D)
  activeAnimation: string;

  // Sección destino (para cambiar después de la animación de salida)
  pendingSection: SectionId | null;

  // Idle destino (para cambiar después de la animación de transición)
  pendingIdle: IdleState | null;

  // Cola de animaciones pendientes
  animationQueue: QueuedAnimation[];

  // Acciones
  setCurrentSection: (sectionId: SectionId) => void;
  scrollToSection: (sectionId: SectionId) => void;
  navigateToSection: (
    sectionId: SectionId,
    direction: NavigationDirection,
  ) => void;
  registerSection: (sectionId: SectionId, element: HTMLElement) => void;
  initializeSections: () => void;
  setTransitioning: (transitioning: boolean) => void;
  getCurrentCameraPosition: () => CameraPosition | null;
  getAnimationSettings: () => typeof animationSettings;
  navigateNext: () => void;
  navigatePrevious: () => void;
  onAnimationComplete: (animationName: string) => void;
  setAnimationSequenceActive: (active: boolean) => void;
  processAnimationQueue: () => void;
}

// Store de navegación
export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentSection: "inicio",
  isScrolling: false,
  isTransitioning: false,
  isAnimationSequenceActive: false,
  navigationDirection: null,
  currentIdle: "Idle 01",
  activeAnimation: "Idle 01",
  pendingSection: null,
  pendingIdle: null,
  animationQueue: [],

  sections: [
    {
      id: "inicio",
      label: "Inicio",
      cameraPosition: {
        position: { x: 0, y: 3.911, z: 13.5 },
        lookAt: { x: 0, y: 3.911, z: 3.468 },
        fov: 20,
      },
    },
    {
      id: "manifiesto",
      label: "Manifiesto",
      cameraPosition: {
        position: { x: 0, y: 0.657, z: 15 },
        lookAt: { x: 0, y: 0.657, z: 3.468 },
        fov: 20,
      },
    },
    {
      id: "trabajos",
      label: "Trabajos",
      cameraPosition: {
        position: { x: 0, y: -2.677, z: 15 },
        lookAt: { x: 0, y: -2.677, z: 3.468 },
        fov: 20,
      },
    },
    {
      id: "algunaIdea",
      label: "¿Alguna idea?",
      cameraPosition: {
        position: { x: 0, y: -6.029, z: 15 },
        lookAt: { x: 0, y: -6.029, z: 3.468 },
        fov: 20,
      },
    },
    {
      id: "cursos",
      label: "Cursos",
      cameraPosition: {
        position: { x: 0, y: -9.373, z: 15 },
        lookAt: { x: 0, y: -9.373, z: 3.468 },
        fov: 20,
      },
    },
    {
      id: "sobreMi",
      label: "Sobre Mi",
      cameraPosition: {
        position: { x: 0, y: -12.724, z: 15 },
        lookAt: { x: 0, y: -12.724, z: 3.468 },
        fov: 20,
      },
    },
    {
      id: "tienda",
      label: "Tienda",
      cameraPosition: {
        position: { x: 0, y: -16.078, z: 15 },
        lookAt: { x: 0, y: -16.078, z: 3.468 },
        fov: 20,
      },
    },
    {
      id: "contacto",
      label: "Contacta",
      cameraPosition: {
        position: { x: 0, y: -19.432, z: 15 },
        lookAt: { x: 0, y: -19.432, z: 3.468 },
        fov: 20,
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
    },
    {
      id: "postFooter",
      label: "Post Footer",
      cameraPosition: {
        position: { x: 0, y: -26.14, z: 15 },
        lookAt: { x: 0, y: -26.14, z: 3.468 },
        fov: 20,
      },
    },
  ],

  setCurrentSection: (sectionId: SectionId) => {
    // Solo cambia la sección, mantiene el idle actual
    set({
      currentSection: sectionId,
      navigationDirection: null,
    });
  },

  setTransitioning: (transitioning: boolean) => {
    set({ isTransitioning: transitioning });
  },

  getCurrentCameraPosition: () => {
    const { currentSection, sections } = get();
    const section = sections.find((s) => s.id === currentSection);
    return section?.cameraPosition || null;
  },

  getAnimationSettings: () => {
    return animationSettings;
  },

  navigateNext: () => {
    const { currentSection, sections, isTransitioning } = get();
    if (isTransitioning) return;

    const currentIndex = sections.findIndex((s) => s.id === currentSection);
    const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
    if (nextIndex !== currentIndex) {
      get().navigateToSection(sections[nextIndex].id, "down");
    }
  },

  navigatePrevious: () => {
    const { currentSection, sections, isTransitioning } = get();
    if (isTransitioning) return;

    const currentIndex = sections.findIndex((s) => s.id === currentSection);
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex !== currentIndex) {
      get().navigateToSection(sections[prevIndex].id, "up");
    }
  },

  navigateToSection: (
    sectionId: SectionId,
    direction: NavigationDirection = null,
  ) => {
    const { currentSection, animationQueue } = get();

    // Calcular el idle "virtual" actual (considerando animaciones en cola)
    // Es el idle final después de que todas las animaciones en cola se completen
    let virtualIdle = get().currentIdle;
    if (animationQueue.length > 0) {
      virtualIdle = animationQueue[animationQueue.length - 1].targetIdle;
    } else if (get().pendingIdle) {
      virtualIdle = get().pendingIdle!;
    }

    // Obtener configuración de transición para la sección ORIGEN
    const originConfig = sectionTransitions[currentSection];

    // Determinar el idle destino al SALIR de la sección actual
    const exitIdle =
      direction === "down"
        ? originConfig.exitDown
        : direction === "up"
          ? originConfig.exitUp
          : null;

    console.log(`[NAV] ${currentSection} → ${sectionId} (${direction})`);
    console.log(
      `[NAV] virtualIdle: ${virtualIdle}, exitIdle: ${exitIdle}, queue length: ${animationQueue.length}`,
    );

    // Si hay transición necesaria Y el idle virtual es diferente al destino
    if (exitIdle && virtualIdle !== exitIdle) {
      const transitionKey = `${virtualIdle}->${exitIdle}`;
      const animation = transitionAnimations[transitionKey];
      console.log(`[NAV] Queueing: ${transitionKey} → Animation: ${animation}`);

      if (animation) {
        // Añadir animación a la cola
        const newQueue = [
          ...animationQueue,
          { animation, targetIdle: exitIdle },
        ];
        set({
          isTransitioning: true,
          currentSection: sectionId,
          navigationDirection: direction,
          animationQueue: newQueue,
        });

        // Si no hay animación reproduciéndose, procesar la cola
        if (!get().isAnimationSequenceActive) {
          get().processAnimationQueue();
        }
      } else {
        // No hay animación definida → cambiar sección, idle se actualizará cuando sea posible
        set({
          isTransitioning: true,
          currentSection: sectionId,
          navigationDirection: direction,
        });
      }
    } else {
      // No hay transición necesaria → solo cambiar sección
      console.log(
        `[NAV] No transition needed, keeping virtualIdle: ${virtualIdle}`,
      );
      set({
        isTransitioning: true,
        currentSection: sectionId,
        navigationDirection: direction,
      });
    }

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
    const { currentSection, sections, animationQueue } = get();

    // Find indices to determine direction
    const currentIndex = sections.findIndex((s) => s.id === currentSection);
    const targetIndex = sections.findIndex((s) => s.id === sectionId);

    if (currentIndex === targetIndex) return;

    const direction = targetIndex > currentIndex ? "down" : "up";

    console.log(`[HEADER NAV] ${currentSection} → ${sectionId} (${direction})`);

    // Calculate virtualIdle considering current queue
    let virtualIdle = get().currentIdle;
    if (animationQueue.length > 0) {
      virtualIdle = animationQueue[animationQueue.length - 1].targetIdle;
    } else if (get().pendingIdle) {
      virtualIdle = get().pendingIdle!;
    }

    // Build queue of all transitions needed to reach the target section
    const newAnimationsToQueue: QueuedAnimation[] = [];

    if (direction === "down") {
      // Going down: iterate from current to target-1 (exit transitions)
      for (let i = currentIndex; i < targetIndex; i++) {
        const traverseSection = sections[i].id;
        const config = sectionTransitions[traverseSection];
        const exitIdle = config.exitDown;

        if (exitIdle && virtualIdle !== exitIdle) {
          const transitionKey = `${virtualIdle}->${exitIdle}`;
          const animation = transitionAnimations[transitionKey];

          if (animation) {
            console.log(`[HEADER NAV] Queue: ${transitionKey} → ${animation}`);
            newAnimationsToQueue.push({ animation, targetIdle: exitIdle });
            virtualIdle = exitIdle; // Update virtualIdle for next iteration
          }
        }
      }
    } else {
      // Going up: iterate from current to target+1 (exit transitions)
      for (let i = currentIndex; i > targetIndex; i--) {
        const traverseSection = sections[i].id;
        const config = sectionTransitions[traverseSection];
        const exitIdle = config.exitUp;

        if (exitIdle && virtualIdle !== exitIdle) {
          const transitionKey = `${virtualIdle}->${exitIdle}`;
          const animation = transitionAnimations[transitionKey];

          if (animation) {
            console.log(`[HEADER NAV] Queue: ${transitionKey} → ${animation}`);
            newAnimationsToQueue.push({ animation, targetIdle: exitIdle });
            virtualIdle = exitIdle; // Update virtualIdle for next iteration
          }
        }
      }
    }

    // Merge new animations with existing queue
    const finalQueue = [...animationQueue, ...newAnimationsToQueue];

    set({
      isScrolling: true,
      isTransitioning: true,
      currentSection: sectionId,
      navigationDirection: direction,
      animationQueue: finalQueue,
    });

    // Start processing queue if not already active
    if (newAnimationsToQueue.length > 0 && !get().isAnimationSequenceActive) {
      get().processAnimationQueue();
    }

    // Scroll to HTML element
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Desbloquear el observer después del scroll
    setTimeout(() => {
      set({ isScrolling: false });
    }, 1000);
  },

  registerSection: (sectionId: SectionId, element: HTMLElement) => {
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, element } : section,
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
      },
    );

    // Observar todas las secciones
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });
  },

  setAnimationSequenceActive: (active: boolean) => {
    set({ isAnimationSequenceActive: active });
  },

  processAnimationQueue: () => {
    const { animationQueue, currentIdle } = get();

    if (animationQueue.length === 0) {
      // Cola vacía, reproducir el idle actual
      console.log(`[QUEUE] Empty, playing idle: ${currentIdle}`);
      set({
        activeAnimation: currentIdle,
        isAnimationSequenceActive: false,
        pendingIdle: null,
      });
      return;
    }

    // Sacar la primera animación de la cola
    const [next, ...rest] = animationQueue;
    console.log(
      `[QUEUE] Processing: ${next.animation} → ${next.targetIdle}, remaining: ${rest.length}`,
    );

    set({
      animationQueue: rest,
      activeAnimation: next.animation,
      isAnimationSequenceActive: true,
      pendingIdle: next.targetIdle,
    });
  },

  onAnimationComplete: (animationName: string) => {
    const { isAnimationSequenceActive, pendingIdle, animationQueue } = get();
    console.log(
      `[ANIM] Complete: ${animationName}, pendingIdle: ${pendingIdle}, queue: ${animationQueue.length}`,
    );

    if (!isAnimationSequenceActive) {
      return;
    }

    // Aplicar el idle de la animación que terminó
    if (pendingIdle) {
      console.log(`[ANIM] Applying idle: ${pendingIdle}`);
      set({
        currentIdle: pendingIdle,
        pendingIdle: null,
      });
    }

    // Procesar la siguiente animación de la cola
    get().processAnimationQueue();
  },
}));
