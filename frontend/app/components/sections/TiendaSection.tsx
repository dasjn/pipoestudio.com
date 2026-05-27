"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PipoProductCard, { type PipoProductCardData } from "../PipoProductCard";
import Button from "../Button";

interface TiendaSectionData {
  title?: string;
  subtitle?: string;
}

interface TiendaSectionProps {
  data?: TiendaSectionData;
  products?: PipoProductCardData[];
  mobile?: boolean;
}

const DEFAULT_TITLE = "TIENDA";
const DEFAULT_SUBTITLE = "NO SIEMPRE HAY... ASÍ QUE APROVECHA.";
const GREEN = "#00A750";
const CARDS_PER_PAGE = 3;
const SLIDE_OFFSET = 700;

const slideVariants = {
  enter: (d: number) => ({
    x: d > 0 ? SLIDE_OFFSET : -SLIDE_OFFSET,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({
    x: d > 0 ? -SLIDE_OFFSET : SLIDE_OFFSET,
    opacity: 0,
  }),
};

function NavArrow({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        ...(dir === "prev" ? { left: 25 } : { right: 25 }),
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
    >
      <Button
        as="button"
        variant="secondary"
        size="sm"
        onClick={onClick}
        className="!px-[10px] !py-[10px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={dir === "prev" ? { transform: "scaleX(-1)" } : undefined}
        >
          <path
            d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
            fill="currentColor"
          />
        </svg>
      </Button>
    </div>
  );
}

export default function TiendaSection({
  data,
  products = [],
  mobile = false,
}: TiendaSectionProps) {
  const title = data?.title ?? DEFAULT_TITLE;
  const subtitle = data?.subtitle ?? DEFAULT_SUBTITLE;

  const count = products.length;
  const totalPages = Math.ceil(count / CARDS_PER_PAGE);

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  function goNext() {
    setDirection(1);
    setPage((p) => (p + 1) % totalPages);
  }

  function goPrev() {
    setDirection(-1);
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }

  function goTo(p: number) {
    if (p === page) return;
    setDirection(p > page ? 1 : -1);
    setPage(p);
  }

  const currentCards = products.slice(
    page * CARDS_PER_PAGE,
    (page + 1) * CARDS_PER_PAGE,
  );

  if (mobile) {
    return (
      <section
        id="tienda"
        className="font-sans w-full h-full flex flex-col items-center justify-center gap-4"
      >
        <div className="text-center">
          <p className="font-bold text-3xl leading-none text-green-pipo uppercase">{title}</p>
          <p className="font-bold text-[10px] text-green-pipo uppercase">{subtitle}</p>
        </div>

        {products.length > 0 ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              overflowX: "auto",
              gap: 12,
              paddingLeft: "calc((100% - 70vw) / 2)",
              paddingRight: "calc((100% - 70vw) / 2)",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{ flexShrink: 0, width: "70vw", scrollSnapAlign: "center" }}
              >
                <PipoProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-green-pipo font-bold text-xs">Cargando…</p>
        )}
      </section>
    );
  }

  return (
    <section
      id="tienda"
      className="font-sans w-full h-full flex flex-col items-center justify-center gap-3 px-2 mt-8"
    >
      <div className="text-center">
        <p className="font-bold text-5xl leading-none text-green-pipo uppercase">
          {title}
        </p>
        <p className="font-bold text-[10px] text-green-pipo uppercase">
          {subtitle}
        </p>
      </div>

      {count > 0 ? (
        <>
          <div style={{ position: "relative", width: "100%" }}>
            {totalPages > 1 && <NavArrow dir="prev" onClick={goPrev} />}
            {totalPages > 1 && <NavArrow dir="next" onClick={goNext} />}

            <div style={{ overflow: "hidden" }}>
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex gap-2 w-full justify-center"
                >
                  {Array.from({ length: CARDS_PER_PAGE }, (_, i) => {
                    const product = currentCards[i];
                    return (
                      <div
                        key={i}
                        className="w-48"
                        style={{ visibility: product ? "visible" : "hidden" }}
                      >
                        {product && <PipoProductCard product={product} />}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === page ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: GREEN,
                    opacity: i === page ? 1 : 0.35,
                    border: "none",
                    cursor: "pointer",
                    transition: "width 0.25s ease, opacity 0.25s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-green-pipo font-bold text-xs">Cargando…</p>
      )}
    </section>
  );
}
