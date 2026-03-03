import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useNavigationStore } from "../store/navigationStore";

const FACIAL_ANIMATIONS = ["C-Cachondo", "C-Enfadado", "C-Jugueton"] as const;
const MIN_INTERVAL_MS = 2000;
const MAX_INTERVAL_MS = 5000;

function randomInterval() {
  return Math.floor(
    Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS) + MIN_INTERVAL_MS,
  );
}

export function useFacialAnimations(
  groupRef: React.MutableRefObject<THREE.Group | undefined>,
  animations: THREE.AnimationClip[],
) {
  const isAnimationSequenceActive = useNavigationStore(
    (s) => s.isAnimationSequenceActive,
  );

  // Mixer dedicado exclusivamente a las animaciones de cara
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // Ref para evitar stale closures en el timer
  const isSequenceActiveRef = useRef(isAnimationSequenceActive);
  const scheduleRef = useRef<() => void>(() => {});
  const lastPlayedRef = useRef<string | null>(null);

  useEffect(() => {
    isSequenceActiveRef.current = isAnimationSequenceActive;
  }, [isAnimationSequenceActive]);

  // Crear mixer de cara cuando el grupo y las animaciones estén listos
  useEffect(() => {
    if (!groupRef.current || animations.length === 0) return;

    mixerRef.current = new THREE.AnimationMixer(groupRef.current);

    return () => {
      mixerRef.current?.stopAllAction();
      mixerRef.current = null;
    };
  }, [groupRef, animations]);

  // Lógica de scheduling y reproducción
  useEffect(() => {
    const facialClips = animations.filter((a) =>
      (FACIAL_ANIMATIONS as readonly string[]).includes(a.name),
    );

    if (facialClips.length === 0) return;

    const playRandom = () => {
      const mixer = mixerRef.current;
      if (!mixer) return;

      const available = facialClips.filter((a) => a.name !== lastPlayedRef.current);
      const pool = available.length > 0 ? available : facialClips;
      const clip = pool[Math.floor(Math.random() * pool.length)];
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = false;
      action.reset();
      action.play();
      isPlayingRef.current = true;
      lastPlayedRef.current = clip.name;

      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action !== action) return;
        mixer.removeEventListener("finished", onFinished as () => void);
        isPlayingRef.current = false;
        // Al terminar, programa la siguiente (si la secuencia ya acabó)
        scheduleRef.current();
      };
      mixer.addEventListener("finished", onFinished as () => void);
    };

    scheduleRef.current = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // Solo jugar si no estamos en medio de un scroll/transición
        if (!isSequenceActiveRef.current) {
          playRandom();
        }
        // Si hay secuencia activa, el effect de isAnimationSequenceActive
        // volverá a llamar a scheduleRef.current() cuando termine
      }, randomInterval());
    };

    // Arrancar el ciclo
    scheduleRef.current();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [animations]);

  // Reaccionar a cambios en el estado de transición
  useEffect(() => {
    if (isAnimationSequenceActive) {
      // Scroll iniciado: cancelar timer pendiente
      // La animación de cara en curso (si hay) termina sola
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Scroll terminado: reanudar ciclo si no hay cara en curso
      // Si hay una cara en curso, onFinished llamará a scheduleRef.current()
      if (!isPlayingRef.current) {
        scheduleRef.current();
      }
    }
  }, [isAnimationSequenceActive]);

  // Actualizar el mixer de cara en cada frame
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });
}
