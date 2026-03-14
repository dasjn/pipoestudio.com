"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useNavigationStore } from "../store/navigationStore";

interface PipoBubbleProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function PipoBubble({
  text,
  style,
  className,
}: PipoBubbleProps) {
  const isAnimationSequenceActive = useNavigationStore(
    (s) => s.isAnimationSequenceActive,
  );

  return (
    <AnimatePresence>
      {!isAnimationSequenceActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={className}
          style={{
            position: "absolute",
            background: "rgba(228,229,224,0.92)",
            borderRadius: 6,
            padding: "8px 12px",
            maxWidth: 200,
            ...style,
          }}
        >
          <p
            className="font-sans font-medium text-green-pipo text-center leading-tight"
            style={{ fontSize: 13, whiteSpace: "pre-line" }}
          >
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
