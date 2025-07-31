"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef, useCallback } from "react";
import { Model } from "./Shelves";
import { Environment } from "@react-three/drei";
import GUI from "lil-gui";
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
        transitionSpeed
      );
      (camera as any).fov = newFov;
      camera.updateProjectionMatrix();
    }

    // Check if transition is complete
    const positionDistance = camera.position.distanceTo(targetPosition);
    const lookAtDistance = currentLookAt.current.distanceTo(targetLookAt);
    const fovDifference = Math.abs((camera as any).fov - targetFov);

    if (positionDistance < 0.01 && lookAtDistance < 0.01 && fovDifference < 0.1 && !transitionCompleteRef.current) {
      transitionCompleteRef.current = true;
      onTransitionComplete?.();
    } else if (positionDistance > 0.1 || lookAtDistance > 0.1 || fovDifference > 1) {
      transitionCompleteRef.current = false;
    }
  });

  return null;
}

// Cube positions from Shelves.tsx
const cubePositions = [
  { name: "Cube035", position: [0, 3.911, 3.468] },
  { name: "Cube036", position: [0, 0.657, 3.468] },
  { name: "Cube037", position: [0, -2.677, 3.468] },
  { name: "Cube038", position: [0, -6.029, 3.468] },
  { name: "Cube039", position: [0, -9.373, 3.468] },
  { name: "Cube040", position: [0, -12.724, 3.468] },
  { name: "Cube041", position: [0, -16.078, 3.468] },
  { name: "Cube042", position: [0, -19.432, 3.468] },
  { name: "Cube043", position: [0, -22.786, 3.468] },
];

// Generate camera presets for each cube
const generateCameraPresets = () => {
  return cubePositions.map((cube, index) => ({
    name: `${cube.name} View`,
    position: { x: 0, y: cube.position[1], z: index == 0 ? 13.5 : 15 },
    lookAt: { x: cube.position[0], y: cube.position[1], z: cube.position[2] },
    fov: 20,
  }));
};

export default function ThreeDCanvas() {
  // Navigation store integration
  const { 
    currentSection, 
    getCurrentCameraPosition, 
    getCurrentAnimations, 
    setTransitioning 
  } = useNavigationStore();
  
  // Enable wheel navigation
  useWheelNavigation();

  const [scrollY, setScrollY] = useState(0);
  const guiRef = useRef<GUI | null>(null);
  const [animationControls, setAnimationControls] = useState<any>({
    clampWhenFinished: true,
    activeAnimations: {},
  });
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);
  const [cameraPresets] = useState(generateCameraPresets());
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);
  const [transitionSpeed, setTransitionSpeed] = useState(0.025);
  const [targetPosition] = useState(new THREE.Vector3(0, 20, 9));
  const [targetLookAt] = useState(new THREE.Vector3(0, 0, 0));
  const [targetFov, setTargetFov] = useState(30);

  // Handle camera transition completion
  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
  }, [setTransitioning]);

  // Update camera and animations based on current section
  useEffect(() => {
    const cameraPosition = getCurrentCameraPosition();
    const animations = getCurrentAnimations();
    
    if (cameraPosition) {
      targetPosition.set(
        cameraPosition.position.x,
        cameraPosition.position.y,
        cameraPosition.position.z
      );
      targetLookAt.set(
        cameraPosition.lookAt.x,
        cameraPosition.lookAt.y,
        cameraPosition.lookAt.z
      );
      setTargetFov(cameraPosition.fov);
    }

    if (animations && availableAnimations.length > 0) {
      const newActiveAnimations: { [key: string]: boolean } = {};
      
      // Reset all animations
      availableAnimations.forEach(animName => {
        newActiveAnimations[animName] = false;
      });
      
      // Activate animations for current section
      animations.activeAnimations.forEach(animName => {
        newActiveAnimations[animName] = true;
      });

      setAnimationControls({
        clampWhenFinished: true,
        activeAnimations: newActiveAnimations,
        triggerUpdate: Date.now(),
      });
    }
  }, [currentSection, availableAnimations]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateAnimationControls = useCallback(() => {
    setAnimationControls((prev: any) => ({ ...prev }));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const gui = new GUI();
      guiRef.current = gui;

      // Camera controls
      const cameraFolder = gui.addFolder("Camera");

      // Camera controls
      const cameraControls = {
        currentShelf: currentPresetIndex,
        transitionSpeed: transitionSpeed,
        goToNext: () => {
          setCurrentPresetIndex((prev) =>
            prev < cameraPresets.length - 1 ? prev + 1 : prev
          );
        },
        goToPrevious: () => {
          setCurrentPresetIndex((prev) => (prev > 0 ? prev - 1 : prev));
        },
        goToTop: () => setCurrentPresetIndex(0),
        goToBottom: () => setCurrentPresetIndex(cameraPresets.length - 1),
      };

      // Shelf selection slider
      cameraFolder
        .add(cameraControls, "currentShelf", 0, cameraPresets.length - 1, 1)
        .name("Shelf Level")
        .onChange((value: number) => {
          setCurrentPresetIndex(value);
        });

      // Navigation buttons
      cameraFolder.add(cameraControls, "goToTop").name("⬆️ Top Shelf");
      cameraFolder.add(cameraControls, "goToPrevious").name("⬆️ Up");
      cameraFolder.add(cameraControls, "goToNext").name("⬇️ Down");
      cameraFolder.add(cameraControls, "goToBottom").name("⬇️ Bottom Shelf");

      // Transition speed control
      cameraFolder
        .add(cameraControls, "transitionSpeed", 0.01, 0.2, 0.01)
        .name("Transition Speed")
        .onChange((value: number) => {
          setTransitionSpeed(value);
        });

      // Manual position override (for fine-tuning)
      const manualFolder = cameraFolder.addFolder("Manual Override");
      const tempPosition = { x: 0, y: 0, z: 9 };
      const tempLookAt = { x: 0, y: 0, z: 0 };

      manualFolder
        .add(tempPosition, "x", -20, 20, 0.1)
        .name("Pos X")
        .onChange((value: number) => {
          targetPosition.setX(value);
        });
      manualFolder
        .add(tempPosition, "y", -30, 10, 0.1)
        .name("Pos Y")
        .onChange((value: number) => {
          targetPosition.setY(value);
        });
      manualFolder
        .add(tempPosition, "z", -20, 20, 0.1)
        .name("Pos Z")
        .onChange((value: number) => {
          targetPosition.setZ(value);
        });

      manualFolder
        .add(tempLookAt, "x", -20, 20, 0.1)
        .name("Look X")
        .onChange((value: number) => {
          targetLookAt.setX(value);
        });
      manualFolder
        .add(tempLookAt, "y", -30, 10, 0.1)
        .name("Look Y")
        .onChange((value: number) => {
          targetLookAt.setY(value);
        });
      manualFolder
        .add(tempLookAt, "z", -20, 20, 0.1)
        .name("Look Z")
        .onChange((value: number) => {
          targetLookAt.setZ(value);
        });

      // Animation controls
      const animFolder = gui.addFolder("Animations");

      // General controls
      animFolder
        .add(animationControls, "clampWhenFinished")
        .name("Stay at end position")
        .onChange(updateAnimationControls);

      const generalControls = {
        playAll: () => {
          const newActive: any = {};
          availableAnimations.forEach((name) => {
            newActive[name] = true;
          });
          setAnimationControls({
            ...animationControls,
            activeAnimations: newActive,
            triggerUpdate: Date.now(),
          });
        },
        stopAll: () => {
          setAnimationControls({
            ...animationControls,
            activeAnimations: {},
            triggerUpdate: Date.now(),
          });
        },
      };

      animFolder.add(generalControls, "playAll").name("Play All");
      animFolder.add(generalControls, "stopAll").name("Stop All");

      return () => {
        gui.destroy();
      };
    }
  }, [
    availableAnimations,
    animationControls,
    cameraPresets.length,
    currentPresetIndex,
    transitionSpeed,
    updateAnimationControls,
  ]);

  // Update GUI when animations are available
  useEffect(() => {
    if (availableAnimations.length > 0 && guiRef.current) {
      const gui = guiRef.current;
      const animFolder = gui.folders.find(
        (f: any) => f._title === "Animations"
      );

      if (animFolder) {
        // Remove existing individual controls
        const controllersToRemove = animFolder.controllers.filter((c: any) =>
          availableAnimations.includes(c.property)
        );
        controllersToRemove.forEach((c: any) => c.destroy());

        // Add individual animation checkboxes
        availableAnimations.forEach((animName) => {
          if (!animationControls.activeAnimations[animName]) {
            animationControls.activeAnimations[animName] = false;
          }

          animFolder
            .add(animationControls.activeAnimations, animName)
            .name(animName)
            .onChange(() => {
              setAnimationControls((prev: any) => ({
                ...prev,
                triggerUpdate: Date.now(),
              }));
            });
        });
      }
    }
  }, [availableAnimations, animationControls]);

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
        />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
