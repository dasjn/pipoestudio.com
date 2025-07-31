import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Cara: THREE.Mesh;
    Cylinder009: THREE.Mesh;
    Cylinder008: THREE.Mesh;
    Cube034: THREE.Mesh;
    Cube035: THREE.Mesh;
    Cube032: THREE.Mesh;
    Cube033: THREE.Mesh;
    Cube031: THREE.Mesh;
    Cube030: THREE.Mesh;
    Cube028: THREE.Mesh;
    Cube029: THREE.Mesh;
    Cube026: THREE.Mesh;
    Cube027: THREE.Mesh;
    Cube025: THREE.Mesh;
    Cube024: THREE.Mesh;
    Cube022: THREE.Mesh;
    Cube023: THREE.Mesh;
    Cube036: THREE.Mesh;
    Cube037: THREE.Mesh;
    Cube038: THREE.Mesh;
    Cube039: THREE.Mesh;
    Cube040: THREE.Mesh;
    Cube041: THREE.Mesh;
    Cube042: THREE.Mesh;
    Cube043: THREE.Mesh;
    Module01: THREE.Mesh;
    Module02: THREE.Mesh;
    Module03: THREE.Mesh;
    Module02001: THREE.Mesh;
    Module02002: THREE.Mesh;
    Module02003: THREE.Mesh;
    Module02004: THREE.Mesh;
    Module02005: THREE.Mesh;
    Bone: THREE.Bone;
  };
  materials: {
    ["Pipo Wood Boton"]: THREE.MeshStandardMaterial;
    ["Pipo Caras"]: THREE.MeshStandardMaterial;
    ["Pipo Wood 01"]: THREE.MeshStandardMaterial;
    ["Pipo Wood 02"]: THREE.MeshStandardMaterial;
    ["Module 01"]: THREE.MeshStandardMaterial;
  };
};

type ActionName = "Idle" | "Action" | "Action.001" | "Action.002";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

interface ModelProps extends React.ComponentProps<"group"> {
  animationControls?: {
    activeAnimations: { [key: string]: boolean };
    clampWhenFinished: boolean;
    triggerUpdate?: number;
  };
  onAnimationsLoaded?: (animations: string[]) => void;
}

export function Model({ animationControls, onAnimationsLoaded, ...props }: ModelProps) {
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(
    "/models/Pipo_Todo_Prueba_v05.glb"
  ) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);
  console.log("Loaded actions:", Object.keys(actions));

  // State for animation blending
  const animationMixer = useRef<THREE.AnimationMixer | null>(null);
  const blendedActions = useRef<{ [key: string]: THREE.AnimationAction }>({});

  useEffect(() => {
    if (onAnimationsLoaded && animations.length > 0) {
      const animationNames = animations.map(anim => anim.name);
      onAnimationsLoaded(animationNames);
    }
  }, [animations, onAnimationsLoaded]);

  useEffect(() => {
    if (group.current && animations.length > 0) {
      // Create mixer
      animationMixer.current = new THREE.AnimationMixer(group.current);

      // Create actions for all animations
      animations.forEach((animation) => {
        const action = animationMixer.current!.clipAction(animation);
        action.clampWhenFinished = animationControls?.clampWhenFinished ?? true;
        blendedActions.current[animation.name] = action;
      });
    }

    return () => {
      if (animationMixer.current) {
        animationMixer.current.stopAllAction();
      }
    };
  }, [animations, animationControls?.clampWhenFinished]);

  useEffect(() => {
    if (animationControls && animationMixer.current) {
      Object.keys(blendedActions.current).forEach((animName) => {
        const action = blendedActions.current[animName];
        const shouldPlay = animationControls.activeAnimations[animName];
        
        if (shouldPlay && !action.isRunning()) {
          action.reset();
          action.play();
        } else if (!shouldPlay && action.isRunning()) {
          action.stop();
        }
      });
    }
  }, [animationControls?.activeAnimations, animationControls?.triggerUpdate]);

  // Update mixer on each frame
  useFrame((state, delta) => {
    if (animationMixer.current) {
      animationMixer.current.update(delta);
    }
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Armature001"
          position={[-1.684, 2.717, 3.473]}
          scale={0.236}
        >
          <primitive object={nodes.Bone} />
        </group>
        {/* <mesh
          name="Cube036"
          castShadow
          receiveShadow
          geometry={nodes.Cube036.geometry}
          material={nodes.Cube036.material}
          position={[0, 0.657, 3.468]}
          scale={0.253}
        />
        <mesh
          name="Cube037"
          castShadow
          receiveShadow
          geometry={nodes.Cube037.geometry}
          material={nodes.Cube037.material}
          position={[0, -2.677, 3.468]}
          scale={0.253}
        />
        <mesh
          name="Cube038"
          castShadow
          receiveShadow
          geometry={nodes.Cube038.geometry}
          material={nodes.Cube038.material}
          position={[0, -6.029, 3.468]}
          scale={0.253}
        />
        <mesh
          name="Cube039"
          castShadow
          receiveShadow
          geometry={nodes.Cube039.geometry}
          material={nodes.Cube039.material}
          position={[0, -9.373, 3.468]}
          scale={0.253}
        />
        <mesh
          name="Cube040"
          castShadow
          receiveShadow
          geometry={nodes.Cube040.geometry}
          material={nodes.Cube040.material}
          position={[0, -12.724, 3.468]}
          scale={0.253}
        />
        <mesh
          name="Cube041"
          castShadow
          receiveShadow
          geometry={nodes.Cube041.geometry}
          material={nodes.Cube041.material}
          position={[0, -16.078, 3.468]}
          scale={0.253}
        />
        <mesh
          name="Cube042"
          castShadow
          receiveShadow
          geometry={nodes.Cube042.geometry}
          material={nodes.Cube042.material}
          position={[0, -19.432, 3.468]}
          scale={0.253}
        />
        <mesh
          name="Cube043"
          castShadow
          receiveShadow
          geometry={nodes.Cube043.geometry}
          material={nodes.Cube043.material}
          position={[0, -22.786, 3.468]}
          scale={0.253}
        /> */}
        <mesh
          name="Module01"
          castShadow
          receiveShadow
          geometry={nodes.Module01.geometry}
          material={materials["Module 01"]}
          position={[0, 0.657, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02"
          castShadow
          receiveShadow
          geometry={nodes.Module02.geometry}
          material={materials["Module 01"]}
          position={[0, -19.432, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module03"
          castShadow
          receiveShadow
          geometry={nodes.Module03.geometry}
          material={materials["Module 01"]}
          position={[0, -22.786, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02001"
          castShadow
          receiveShadow
          geometry={nodes.Module02001.geometry}
          material={materials["Module 01"]}
          position={[0, -16.078, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02002"
          castShadow
          receiveShadow
          geometry={nodes.Module02002.geometry}
          material={materials["Module 01"]}
          position={[0, -12.724, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02003"
          castShadow
          receiveShadow
          geometry={nodes.Module02003.geometry}
          material={materials["Module 01"]}
          position={[0, -9.373, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02004"
          castShadow
          receiveShadow
          geometry={nodes.Module02004.geometry}
          material={materials["Module 01"]}
          position={[0, -6.029, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02005"
          castShadow
          receiveShadow
          geometry={nodes.Module02005.geometry}
          material={materials["Module 01"]}
          position={[0, -2.677, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/Pipo_Todo_Prueba_v05.glb");
