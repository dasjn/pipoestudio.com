"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrabajosStore } from "@/app/store/trabajosStore";
import Button from "@/app/components/Button";

interface FotoItem {
  url: string;
  nombre?: string;
  descripcion?: string;
}

// Posiciones de los dots — ajustar a ojo en la vista (% del slot)
const DOT_POSITIONS: { x: number; y: number }[] = [
  { x: 40, y: 55 }, // foto 1
  { x: 60, y: 70 }, // foto 2
  { x: 75, y: 80 }, // foto 3
  { x: 25, y: 85 }, // foto 4
];

interface TrabajosSectionData {
  _type: "trabajosSection";
  statement?: string;
  buttonText?: string;
  buttonUrl?: string;
  fotos?: FotoItem[];
}

interface TrabajosSectionProps {
  data?: TrabajosSectionData;
}

const DEFAULT_STATEMENT = "PROYECTOS QUE HABLAN POR SÍ SOLOS.";
const DEFAULT_BUTTON_TEXT = "Ver más";
const FOTOS_PER_PAGE = 4;

const PILL_H = 40;
const GREEN = 12;
const GREEN_MARGIN = (PILL_H - GREEN) / 2;

// ─── Dot expandible ───────────────────────────────────────────────────────────

function WorkDot({
  foto,
  pos,
}: {
  foto: FotoItem;
  pos: { x: number; y: number };
}) {
  const [hovered, setHovered] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [expandedWidth, setExpandedWidth] = useState<number>(PILL_H);

  useEffect(() => {
    if (textRef.current) {
      const textW = textRef.current.scrollWidth;
      setExpandedWidth(PILL_H + textW + GREEN_MARGIN);
    }
  }, [foto.nombre, foto.descripcion]);

  if (!foto.nombre && !foto.descripcion) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(-${PILL_H / 2}px, -50%)`,
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        initial={{ width: PILL_H }}
        animate={{ width: hovered ? expandedWidth : PILL_H }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        style={{
          height: PILL_H,
          borderRadius: 99,
          background: "white",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 14px rgba(0,0,0,0.16)",
          cursor: "pointer",
        }}
      >
        {/* Círculo verde */}
        <div
          style={{
            width: GREEN,
            height: GREEN,
            borderRadius: "50%",
            background: "#00A750",
            flexShrink: 0,
            marginLeft: GREEN_MARGIN,
            marginRight: GREEN_MARGIN,
          }}
        />

        {/* Texto */}
        <motion.div
          ref={textRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.1, delay: hovered ? 0.18 : 0 }}
          style={{
            paddingRight: 12,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {foto.nombre && (
            <p
              className="font-sans font-bold"
              style={{
                color: "#00A750",
                fontSize: 12,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {foto.nombre}
            </p>
          )}
          {foto.descripcion && (
            <p
              className="font-sans"
              style={{
                color: "#00A750",
                fontSize: 11,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {foto.descripcion}
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Sección principal ────────────────────────────────────────────────────────

export default function TrabajosSection({ data }: TrabajosSectionProps) {
  const statement = data?.statement || DEFAULT_STATEMENT;
  const fotos = data?.fotos ?? [];
  const totalPages = Math.max(1, Math.ceil(fotos.length / FOTOS_PER_PAGE));

  const { page, setPage } = useTrabajosStore();
  const currentFotos = fotos.slice(page * FOTOS_PER_PAGE, (page + 1) * FOTOS_PER_PAGE);

  function goToNextPage() {
    setPage((page + 1) % totalPages);
  }

  return (
    <section id="trabajos" className="w-full h-full relative">
      <div
        className="flex flex-col items-center justify-start gap-2 px-2"
        style={{ transform: "translateY(80px)" }}
      >
        <p className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-green-pipo">
          {statement}
        </p>

        {totalPages > 1 && (
          <Button as="button" variant="primary" size="sm" onClick={goToNextPage}>
            {data?.buttonText ?? DEFAULT_BUTTON_TEXT}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
              aria-hidden="true"
            >
              {"rotate_right"}
            </span>
          </Button>
        )}
      </div>

      <AnimatePresence>
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {currentFotos.map((foto, i) => (
            <WorkDot
              key={i}
              foto={foto}
              pos={DOT_POSITIONS[i] ?? { x: 50, y: 50 }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
