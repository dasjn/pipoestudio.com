"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";

export interface GalleryImage {
  url: string;
  alt?: string;
}

interface WorkGalleryLightboxProps {
  images: GalleryImage[];
  title?: string;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 60;

export default function WorkGalleryLightbox({
  images,
  title,
  onClose,
}: WorkGalleryLightboxProps) {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [mounted, setMounted] = useState(false);

  const total = images.length;

  const paginate = useCallback(
    (dir: number) => {
      if (total <= 1) return;
      setIndex(([prev]) => [(prev + dir + total) % total, dir]);
    },
    [total]
  );

  // Portal target only exists on the client
  useEffect(() => setMounted(true), []);

  // Keyboard navigation + close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") paginate(1);
      else if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, paginate]);

  const bind = useDrag(
    ({ last, movement: [mx], direction: [dx] }) => {
      if (last && Math.abs(mx) > SWIPE_THRESHOLD) {
        paginate(dx < 0 ? 1 : -1);
      }
    },
    { axis: "x", filterTaps: true }
  );

  if (!mounted || total === 0) return null;

  const current = images[index];

  return createPortal(
    <motion.div
      data-no-nav-scroll
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 190,
        background: "rgba(0,0,0,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {/* Cerrar */}
      <button
        onClick={onClose}
        aria-label="Cerrar galería"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          close
        </span>
      </button>

      {/* Título */}
      {title && (
        <p
          className="font-sans font-bold"
          style={{
            position: "absolute",
            top: 28,
            left: 24,
            color: "white",
            fontSize: 14,
            margin: 0,
            maxWidth: "60%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </p>
      )}

      {/* Flechas (desktop) */}
      {total > 1 && (
        <>
          <NavArrow side="left" onClick={() => paginate(-1)} />
          <NavArrow side="right" onClick={() => paginate(1)} />
        </>
      )}

      {/* Imagen con swipe */}
      <div
        {...bind()}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "90vw",
          height: "78vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "pan-y",
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={current.url}
            alt={current.alt ?? title ?? `Foto ${index + 1}`}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            draggable={false}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          />
        </AnimatePresence>
      </div>

      {/* Contador */}
      {total > 1 && (
        <p
          className="font-sans"
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: 13,
            margin: 0,
            letterSpacing: 1,
          }}
        >
          {index + 1} / {total}
        </p>
      )}
    </motion.div>,
    document.body
  );
}

function NavArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={side === "left" ? "Anterior" : "Siguiente"}
      style={{
        position: "absolute",
        [side]: 16,
        top: "50%",
        transform: "translateY(-50%)",
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.12)",
        color: "white",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
        {side === "left" ? "chevron_left" : "chevron_right"}
      </span>
    </button>
  );
}
