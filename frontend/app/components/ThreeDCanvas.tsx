"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef, useCallback } from "react";
import { Model, type SectionsData } from "./Shelves";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useNavigationStore } from "../store/navigationStore";
import { useWheelNavigation } from "../hooks/useWheelNavigation";

function CameraController({
  targetPosition,
  targetLookAt,
  targetFov,
  transitionSpeed = 0.05,
  onTransitionComplete,
}: {
  targetPosition: THREE.Vector3;
  targetLookAt: THREE.Vector3;
  targetFov: number;
  transitionSpeed?: number;
  onTransitionComplete?: () => void;
}) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const transitionCompleteRef = useRef(false);

  useFrame(() => {
    // Smooth position transition
    camera.position.lerp(targetPosition, transitionSpeed);

    // Smooth lookAt transition
    currentLookAt.current.lerp(targetLookAt, transitionSpeed);
    camera.lookAt(currentLookAt.current);

    // Smooth FOV transition
    if ("fov" in camera) {
      const currentFov = (camera as any).fov;
      const newFov = THREE.MathUtils.lerp(
        currentFov,
        targetFov,
        transitionSpeed,
      );
      (camera as any).fov = newFov;
      camera.updateProjectionMatrix();
    }

    // Check if transition is complete
    const positionDistance = camera.position.distanceTo(targetPosition);
    const lookAtDistance = currentLookAt.current.distanceTo(targetLookAt);
    const fovDifference = Math.abs((camera as any).fov - targetFov);

    if (
      positionDistance < 0.01 &&
      lookAtDistance < 0.01 &&
      fovDifference < 0.1 &&
      !transitionCompleteRef.current
    ) {
      transitionCompleteRef.current = true;
      onTransitionComplete?.();
    } else if (
      positionDistance > 0.1 ||
      lookAtDistance > 0.1 ||
      fovDifference > 1
    ) {
      transitionCompleteRef.current = false;
    }
  });

  return null;
}

export default function ThreeDCanvas({
  sectionsData,
}: {
  sectionsData?: SectionsData;
}) {
  // Navigation store integration
  const {
    currentSection,
    getCurrentCameraPosition,
    getAnimationSettings,
    setTransitioning,
    onAnimationComplete,
    activeAnimation,
  } = useNavigationStore();

  // Enable wheel navigation
  useWheelNavigation();

  const [animationControls, setAnimationControls] = useState<any>({
    clampWhenFinished: true,
    activeAnimations: {},
  });
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);
  const [transitionSpeed] = useState(0.025);
  const [targetPosition] = useState(new THREE.Vector3(0, 20, 9));
  const [targetLookAt] = useState(new THREE.Vector3(0, 0, 0));
  const [targetFov, setTargetFov] = useState(30);

  // Calculate dynamic FOV based on viewport
  const calculateDynamicFov = useCallback((baseFov: number) => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;

    if (viewportWidth < 768) {
      return baseFov * 2.8;
    } else if (viewportWidth < 1024) {
      return baseFov * 2.4;
    } else if (viewportWidth < 1440) {
      return baseFov * 2;
    }
    return baseFov;
  }, []);

  // Handle camera transition completion
  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
  }, [setTransitioning]);

  // Update camera based on current section
  useEffect(() => {
    const cameraPosition = getCurrentCameraPosition();

    if (cameraPosition) {
      targetPosition.set(
        cameraPosition.position.x,
        cameraPosition.position.y,
        cameraPosition.position.z,
      );
      targetLookAt.set(
        cameraPosition.lookAt.x,
        cameraPosition.lookAt.y,
        cameraPosition.lookAt.z,
      );

      // FOV dinámico basado en viewport
      const adjustedFov = calculateDynamicFov(cameraPosition.fov);
      setTargetFov(adjustedFov);
    }
  }, [currentSection, calculateDynamicFov]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update animations based on activeAnimation from store
  useEffect(() => {
    if (activeAnimation && availableAnimations.length > 0) {
      const newActiveAnimations: { [key: string]: boolean } = {};

      // Reset all animations
      availableAnimations.forEach((animName) => {
        newActiveAnimations[animName] = false;
      });

      // Activate the current animation
      newActiveAnimations[activeAnimation] = true;

      setAnimationControls({
        activeAnimations: newActiveAnimations,
        animationSettings: getAnimationSettings(),
        triggerUpdate: Date.now(),
      });
    }
  }, [activeAnimation, availableAnimations, getAnimationSettings]);

  // Listen for viewport changes to adjust FOV and sync sections
  useEffect(() => {
    const handleResize = () => {
      const cameraPosition = getCurrentCameraPosition();
      if (cameraPosition) {
        const adjustedFov = calculateDynamicFov(cameraPosition.fov);
        setTargetFov(adjustedFov);
      }

      // Re-trigger section detection after resize
      setTimeout(() => {
        // Force re-detection of current section
        const sections = document.querySelectorAll("section[id]");
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + scrollTop;
          const sectionBottom = sectionTop + rect.height;

          // Check if section is currently in viewport center
          const viewportCenter = scrollTop + viewportHeight / 2;
          if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
            const { setCurrentSection } = useNavigationStore.getState();
            setCurrentSection(section.id as any);
          }
        });
      }, 100);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [getCurrentCameraPosition, calculateDynamicFov]);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 20, 9], fov: 30 }}
        className="w-full h-full"
      >
        <CameraController
          targetPosition={targetPosition}
          targetLookAt={targetLookAt}
          targetFov={targetFov}
          transitionSpeed={transitionSpeed}
          onTransitionComplete={handleTransitionComplete}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Model
          animationControls={animationControls}
          onAnimationsLoaded={setAvailableAnimations}
          onAnimationComplete={onAnimationComplete}
          sectionsData={sectionsData}
        />
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  );
}
