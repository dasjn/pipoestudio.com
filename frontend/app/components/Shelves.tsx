import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useNavigationStore } from "../store/navigationStore";
import ManifiestoSection from "./sections/ManifiestoSection";
import TrabajosSection from "./sections/TrabajosSection";
import AlgunaIdeaSection from "./sections/AlgunaIdeaSection";
import CursosSection from "./sections/CursosSection";
import SobreMiSection from "./sections/SobreMiSection";
import TiendaSection from "./sections/TiendaSection";
import ContactoSection from "./sections/ContactoSection";
import FooterSection from "./sections/Footer";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
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

// Dimensiones world-space de los planos de sección (scale de los meshes)
const PLANE_W = 3.446;
const PLANE_H = 1.889;

// Tamaño de referencia en px al que están diseñadas las secciones.
// Todo el contenido escala desde este tamaño al tamaño real proyectado.
const REF_W = 600;
const REF_H = Math.round(REF_W * (PLANE_H / PLANE_W)); // ~329px

function BoundedHtml({
  position,
  isActive,
  children,
}: {
  position: [number, number, number];
  isActive: boolean;
  children: React.ReactNode;
}) {
  const { camera, size } = useThree();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tl = useRef(new THREE.Vector3());
  const br = useRef(new THREE.Vector3());
  const [px, py, pz] = position;

  useFrame(() => {
    if (!outerRef.current || !innerRef.current) return;
    tl.current.set(px - PLANE_W / 2, py + PLANE_H / 2, pz).project(camera);
    br.current.set(px + PLANE_W / 2, py - PLANE_H / 2, pz).project(camera);
    const w = Math.abs((br.current.x - tl.current.x) / 2) * size.width;
    const h = Math.abs((tl.current.y - br.current.y) / 2) * size.height;
    const scale = w / REF_W;

    outerRef.current.style.width = `${w}px`;
    outerRef.current.style.height = `${h}px`;
    innerRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
  });

  return (
    <Html center>
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div
              ref={outerRef}
              style={{ overflow: "hidden", position: "relative" }}
            >
              <div
                ref={innerRef}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: REF_W,
                  height: REF_H,
                  transformOrigin: "center",
                }}
              >
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
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
  const { currentSection } = useNavigationStore();
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(
    "/models/Pipo_Todo_Prueba_v25.glb",
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
          material={materials.Imagen01}
          position={[-0.771, -3.277, 4.034]}
          rotation={[-0.335, -0.337, -0.114]}
          scale={0.651}
        />
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
          material={materials.Imagen01}
          position={[0.779, -3.277, 4.034]}
          rotation={[-0.321, 0.191, 0.063]}
          scale={0.651}
        />
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
          material={materials.Imagen01}
          position={[1.577, -3.504, 4.573]}
          rotation={[-0.321, 0.191, 0.063]}
          scale={0.467}
        />
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
          material={materials.Imagen01}
          position={[-1.538, -3.501, 4.573]}
          rotation={[-0.337, -0.351, -0.12]}
          scale={0.467}
        />
        <mesh
          name="manifiesto"
          visible={false}
          geometry={nodes.Module01002.geometry}
          position={[0, 0.666, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, 0.666, 3.468]} isActive={currentSection === "manifiesto"}>
            <ManifiestoSection data={sectionsData?.manifiesto} />
          </BoundedHtml>
        </mesh>
        <mesh
          name="trabajos"
          visible={false}
          geometry={nodes.Module01001.geometry}
          position={[0, -2.645, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, -2.645, 3.468]} isActive={currentSection === "trabajos"}>
            <TrabajosSection
              data={sectionsData?.trabajos}
              posts={sectionsData?.posts ?? []}
            />
          </BoundedHtml>
        </mesh>
        <mesh
          name="algunaIdea"
          visible={false}
          geometry={nodes.Module01003.geometry}
          position={[0, -5.983, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, -5.983, 3.468]} isActive={currentSection === "algunaIdea"}>
            <AlgunaIdeaSection data={sectionsData?.algunaIdea} />
          </BoundedHtml>
        </mesh>
        <mesh
          name="cursos"
          visible={false}
          geometry={nodes.Module01004.geometry}
          position={[0, -9.318, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, -9.318, 3.468]} isActive={currentSection === "cursos"}>
            <CursosSection data={sectionsData?.cursos} />
          </BoundedHtml>
        </mesh>
        <mesh
          name="sobreMi"
          visible={false}
          geometry={nodes.Module01005.geometry}
          position={[0, -12.651, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, -12.651, 3.468]} isActive={currentSection === "sobreMi"}>
            <SobreMiSection data={sectionsData?.sobreMi} />
          </BoundedHtml>
        </mesh>
        <mesh
          name="tienda"
          visible={false}
          geometry={nodes.Module01006.geometry}
          position={[0, -15.993, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, -15.993, 3.468]} isActive={currentSection === "tienda"}>
            <TiendaSection data={sectionsData?.tienda} />
          </BoundedHtml>
        </mesh>
        <mesh
          name="contacto"
          visible={false}
          geometry={nodes.Module01007.geometry}
          position={[0, -19.333, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, -19.333, 3.468]} isActive={currentSection === "contacto"}>
            <ContactoSection data={sectionsData?.contacto} />
          </BoundedHtml>
        </mesh>
        <mesh
          name="footer"
          visible={false}
          geometry={nodes.Module01008.geometry}
          position={[0, -22.673, 3.468]}
          scale={[3.446, 1.889, 2.489]}
        >
          <BoundedHtml position={[0, -22.673, 3.468]} isActive={currentSection === "footer"}>
            <FooterSection />
          </BoundedHtml>
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Pipo_Todo_Prueba_v25.glb");
