import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useFacialAnimations } from "../hooks/useFacialAnimations";

export interface SectionsData {
  manifiesto?: any;
  trabajos?: any;
  algunaIdea?: any;
  cursos?: any;
  sobreMi?: any;
  tienda?: any;
  contacto?: any;
  inicio?: any;
  posts: any[];
  products: any[];
}

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
    Module01: THREE.Mesh;
    Module02: THREE.Mesh;
    Module03: THREE.Mesh;
    Module02001: THREE.Mesh;
    Module02002: THREE.Mesh;
    Module02003: THREE.Mesh;
    Module02004: THREE.Mesh;
    Module02005: THREE.Mesh;
    Cube036: THREE.Mesh;
    Cube037: THREE.Mesh;
    Cube038: THREE.Mesh;
    Cube039: THREE.Mesh;
    Cube040: THREE.Mesh;
    Cube041: THREE.Mesh;
    Cube042: THREE.Mesh;
    Cube043: THREE.Mesh;
    Marco01: THREE.Mesh;
    Foto01: THREE.Mesh;
    Marco01001: THREE.Mesh;
    Foto01001: THREE.Mesh;
    Marco01002: THREE.Mesh;
    Foto01002: THREE.Mesh;
    Marco01003: THREE.Mesh;
    Foto01003: THREE.Mesh;
    Module01002: THREE.Mesh;
    Module01001: THREE.Mesh;
    Module01003: THREE.Mesh;
    Module01004: THREE.Mesh;
    Module01005: THREE.Mesh;
    Module01006: THREE.Mesh;
    Module01007: THREE.Mesh;
    Module01008: THREE.Mesh;
    Bone: THREE.Bone;
  };
  materials: {
    ["Pipo Wood Boton"]: THREE.MeshStandardMaterial;
    ["Pipo Caras"]: THREE.MeshStandardMaterial;
    ["Pipo Wood 01"]: THREE.MeshStandardMaterial;
    ["Pipo Wood 02"]: THREE.MeshStandardMaterial;
    Mueble: THREE.MeshStandardMaterial;
    MaderaCuadros: THREE.MeshStandardMaterial;
    Imagen01: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "Idle 01"
  | "Idle 02"
  | "Idle 03"
  | "Idle 04"
  | "Scroll 01- U"
  | "Scroll 01-D"
  | "Scroll 02 - D"
  | "Scroll 02- U"
  | "Scroll 03 - D"
  | "Scroll 03 - U"
  | "Scroll 03 - U.001"
  | "C-Cachondo"
  | "C-Enfadado"
  | "C-Jugueton";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

function FotoTexture({
  url,
  geometry,
}: {
  url: string;
  geometry: THREE.BufferGeometry;
}) {
  const texture = useTexture(url);

  useEffect(() => {
    texture.flipY = false;

    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return;

    const meshAspect = (box.max.x - box.min.x) / (box.max.y - box.min.y);
    const img = texture.image as { width: number; height: number };
    if (!img?.width || !img?.height) return;
    const imageAspect = img.width / img.height;

    // cover: ajusta al margen más pequeño, recorta el grande
    if (imageAspect > meshAspect) {
      // imagen más ancha → encaja alto, recorta anchos
      const s = meshAspect / imageAspect;
      texture.repeat.set(s, 1);
      texture.offset.set((1 - s) / 2, 0);
    } else {
      // imagen más alta → encaja ancho, recorta altos
      const s = imageAspect / meshAspect;
      texture.repeat.set(1, s);
      texture.offset.set(0, (1 - s) / 2);
    }

    texture.needsUpdate = true;
  }, [texture, geometry]);

  return <meshBasicMaterial map={texture} />;
}

interface ModelProps extends React.ComponentProps<"group"> {
  animationControls?: {
    activeAnimations: { [key: string]: boolean };
    animationSettings?: {
      [key: string]: { loop: boolean; clampWhenFinished: boolean };
    };
    triggerUpdate?: number;
  };
  onAnimationsLoaded?: (animations: string[]) => void;
  onAnimationComplete?: (animationName: string) => void;
  sectionsData?: SectionsData;
}

export function Model({
  animationControls,
  onAnimationsLoaded,
  onAnimationComplete,
  sectionsData,
  ...props
}: ModelProps) {
  const fotos: (string | undefined)[] =
    sectionsData?.trabajos?.fotos?.map((f: any) => f.url as string) ?? [];
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(
    "/models/Pipo_Todo_Prueba_v29.glb",
  ) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  // State for animation blending
  const animationMixer = useRef<THREE.AnimationMixer | null>(null);
  const blendedActions = useRef<{ [key: string]: THREE.AnimationAction }>({});
  const animationStartTimes = useRef<{ [key: string]: number }>({});
  const animationDurations = useRef<{ [key: string]: number }>({});
  const completedAnimations = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (onAnimationsLoaded && animations.length > 0) {
      const animationNames = animations.map((anim) => anim.name);
      onAnimationsLoaded(animationNames);
    }
  }, [animations, onAnimationsLoaded]);

  useEffect(() => {
    if (group.current && animations.length > 0) {
      // Limpiar mixer anterior si existe
      if (animationMixer.current) {
        animationMixer.current.stopAllAction();
      }

      // Crear nuevo mixer
      animationMixer.current = new THREE.AnimationMixer(group.current);

      // Limpiar referencias anteriores
      blendedActions.current = {};
      animationStartTimes.current = {};
      animationDurations.current = {};
      completedAnimations.current.clear();

      // Crear actions para todas las animaciones (pero NO reproducirlas)
      animations.forEach((animation) => {
        const action = animationMixer.current!.clipAction(animation);

        // Guardar duración
        animationDurations.current[animation.name] = animation.duration;

        // Configurar como detenida inicialmente
        action.stop();
        action.reset();

        blendedActions.current[animation.name] = action;
      });
    }

    return () => {
      if (animationMixer.current) {
        animationMixer.current.stopAllAction();
      }
    };
  }, [animations]);

  useEffect(() => {
    if (!animationControls || !animationMixer.current) return;

    // Encontrar la animación que debe reproducirse
    const activeAnimName = Object.keys(animationControls.activeAnimations).find(
      (name) => animationControls.activeAnimations[name],
    );

    console.log(`[SHELVES] Playing: ${activeAnimName}`);
    // console.log(`[SHELVES] Available:`, Object.keys(blendedActions.current));

    if (!activeAnimName || !blendedActions.current[activeAnimName]) {
      console.log(`[SHELVES] Animation not found: ${activeAnimName}`);
      return;
    }

    const activeAction = blendedActions.current[activeAnimName];
    const settings = animationControls.animationSettings?.[activeAnimName];

    // Detener TODAS las animaciones primero
    animationMixer.current.stopAllAction();
    animationStartTimes.current = {};
    completedAnimations.current.clear();

    // Configurar la animación activa
    if (settings) {
      activeAction.setLoop(
        settings.loop ? THREE.LoopRepeat : THREE.LoopOnce,
        Infinity,
      );
      activeAction.clampWhenFinished = settings.clampWhenFinished;
    }

    // Iniciar la animación
    activeAction.reset();
    activeAction.setEffectiveTimeScale(1);
    activeAction.setEffectiveWeight(1);
    activeAction.play();

    // Registrar tiempo de inicio para animaciones no-loop
    const isNonLooping = settings && !settings.loop;
    if (isNonLooping) {
      animationStartTimes.current[activeAnimName] = Date.now();
    }
  }, [animationControls]);

  // Animaciones de cara aleatorias (autónomas, mixer independiente)
  useFacialAnimations(group, animations);

  // Update mixer on each frame
  useFrame((state, delta) => {
    if (animationMixer.current) {
      animationMixer.current.update(delta);

      // Check for animation completion based on time
      const currentTime = Date.now();
      Object.keys(animationStartTimes.current).forEach((animName) => {
        const startTime = animationStartTimes.current[animName];
        const duration = animationDurations.current[animName];

        if (
          startTime &&
          duration &&
          !completedAnimations.current.has(animName)
        ) {
          const elapsedTime = (currentTime - startTime) / 1000;

          if (elapsedTime >= duration) {
            completedAnimations.current.add(animName);
            onAnimationComplete?.(animName);
          }
        }
      });
    }
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Armature001"
          position={[1.496, -3.829, 1.977]}
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
          material={materials["Mueble"]}
          position={[0, 0.657, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02"
          castShadow
          receiveShadow
          geometry={nodes.Module02.geometry}
          material={materials["Mueble"]}
          position={[0, -19.432, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module03"
          castShadow
          receiveShadow
          geometry={nodes.Module03.geometry}
          material={materials["Mueble"]}
          position={[0, -22.786, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02001"
          castShadow
          receiveShadow
          geometry={nodes.Module02001.geometry}
          material={materials["Mueble"]}
          position={[0, -16.078, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02002"
          castShadow
          receiveShadow
          geometry={nodes.Module02002.geometry}
          material={materials["Mueble"]}
          position={[0, -12.724, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02003"
          castShadow
          receiveShadow
          geometry={nodes.Module02003.geometry}
          material={materials["Mueble"]}
          position={[0, -9.373, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02004"
          castShadow
          receiveShadow
          geometry={nodes.Module02004.geometry}
          material={materials["Mueble"]}
          position={[0, -6.029, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Module02005"
          castShadow
          receiveShadow
          geometry={nodes.Module02005.geometry}
          material={materials["Mueble"]}
          position={[0, -2.677, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        />
        <mesh
          name="Marco01"
          castShadow
          receiveShadow
          geometry={nodes.Marco01.geometry}
          material={materials.MaderaCuadros}
          position={[-0.771, -3.278, 4.033]}
          rotation={[-0.335, -0.337, -0.114]}
          scale={0.651}
        />
        <mesh
          name="Foto01"
          castShadow
          receiveShadow
          geometry={nodes.Foto01.geometry}
          material={fotos[0] ? undefined : materials.Imagen01}
          position={[-0.771, -3.277, 4.034]}
          rotation={[-0.335, -0.337, -0.114]}
          scale={0.651}
        >
          {fotos[0] && (
            <FotoTexture url={fotos[0]} geometry={nodes.Foto01.geometry} />
          )}
        </mesh>
        <mesh
          name="Marco01001"
          castShadow
          receiveShadow
          geometry={nodes.Marco01001.geometry}
          material={materials.MaderaCuadros}
          position={[0.779, -3.278, 4.033]}
          rotation={[-0.321, 0.191, 0.063]}
          scale={0.651}
        />
        <mesh
          name="Foto01001"
          castShadow
          receiveShadow
          geometry={nodes.Foto01001.geometry}
          material={fotos[1] ? undefined : materials.Imagen01}
          position={[0.779, -3.277, 4.034]}
          rotation={[-0.321, 0.191, 0.063]}
          scale={0.651}
        >
          {fotos[1] && (
            <FotoTexture url={fotos[1]} geometry={nodes.Foto01001.geometry} />
          )}
        </mesh>
        <mesh
          name="Marco01002"
          castShadow
          receiveShadow
          geometry={nodes.Marco01002.geometry}
          material={materials.MaderaCuadros}
          position={[1.576, -3.504, 4.572]}
          rotation={[-0.321, 0.191, 0.063]}
          scale={0.467}
        />
        <mesh
          name="Foto01002"
          castShadow
          receiveShadow
          geometry={nodes.Foto01002.geometry}
          material={fotos[2] ? undefined : materials.Imagen01}
          position={[1.577, -3.504, 4.573]}
          rotation={[-0.321, 0.191, 0.063]}
          scale={0.467}
        >
          {fotos[2] && (
            <FotoTexture url={fotos[2]} geometry={nodes.Foto01002.geometry} />
          )}
        </mesh>
        <mesh
          name="Marco01003"
          castShadow
          receiveShadow
          geometry={nodes.Marco01003.geometry}
          material={materials.MaderaCuadros}
          position={[-1.537, -3.501, 4.572]}
          rotation={[-0.337, -0.351, -0.12]}
          scale={0.467}
        />
        <mesh
          name="Foto01003"
          castShadow
          receiveShadow
          geometry={nodes.Foto01003.geometry}
          material={fotos[3] ? undefined : materials.Imagen01}
          position={[-1.538, -3.501, 4.573]}
          rotation={[-0.337, -0.351, -0.12]}
          scale={0.467}
        >
          {fotos[3] && (
            <FotoTexture url={fotos[3]} geometry={nodes.Foto01003.geometry} />
          )}
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Pipo_Todo_Prueba_v29.glb");
