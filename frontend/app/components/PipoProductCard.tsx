"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Button from "./Button";
import { urlForImage } from "@/sanity/lib/utils";

export interface PipoProductCardData {
  _id: string;
  name?: string;
  subtitle?: string;
  image?: { asset: unknown; alt?: string };
  buttonText?: string;
  soldText?: string;
  priceShippingInfo?: string;
  slug?: string;
  sold?: boolean;
}

interface PipoProductCardProps {
  product: PipoProductCardData;
  onBuyClick?: () => void;
  onContactClick?: () => void;
  contactText?: string;
}

const CARD_BG = "#E4E5E0";
const GREEN = "#00A750";
const PADDING = 10;

export default function PipoProductCard({
  product,
  onBuyClick,
  onContactClick,
  contactText = "CONTÁCTANOS",
}: PipoProductCardProps) {
  const {
    name = "PRODUCTO",
    subtitle,
    image,
    buttonText = "¡LO QUIERO!",
    soldText = "SIN STOCK :(",
    priceShippingInfo,
    sold = false,
  } = product;

  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleOverflow, setTitleOverflow] = useState(0);

  useEffect(() => {
    const container = titleContainerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;
    const overflow = title.offsetWidth - container.clientWidth;
    setTitleOverflow(Math.max(0, overflow));
  }, [name]);

  const imageUrl = image?.asset
    ? urlForImage(image)?.width(600).height(800).url()
    : null;

  return (
    <article
      className="font-sans"
      style={{
        position: "relative",
        background: CARD_BG,
        borderRadius: 6,
        padding: PADDING + 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      {/* Image wrapper — position:relative sin overflow, para que precio
          y título puedan salir sin clipping igual que el bloque de título */}
      <div style={{ position: "relative" }}>
        {/* Image con overflow:hidden propio */}
        <div
          style={{
            position: "relative",
            borderRadius: 6,
            overflow: "hidden",
            aspectRatio: "4 / 5",
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={(image as { alt?: string } | undefined)?.alt || name}
              fill
              style={{
                objectFit: "cover",
                filter: sold ? "grayscale(1)" : "none",
              }}
              sizes="(max-width: 768px) 50vw, 240px"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#b0b0b0",
                filter: sold ? "grayscale(1)" : "none",
              }}
            />
          )}

          {/* Grey overlay when sold */}
          {sold && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(160, 160, 160, 0.4)",
              }}
            />
          )}

          {/* SIN STOCK badge */}
          {sold && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-8deg)",
                background: GREEN,
                color: "white",
                borderRadius: 6,
                padding: "6px 12px",
                fontWeight: 900,
                fontSize: 14,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {soldText}
            </div>
          )}
        </div>

        {/* Title — fuera del overflow:hidden, top-left del wrapper */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Clip wrapper — empieza 2px a la izq para no recortar el margin-left del h3 */}
          <div
            ref={titleContainerRef}
            style={{
              overflowX: "clip",
              overflowY: "visible",
              marginLeft: -2,
              width: "calc(100% + 2px)",
            }}
          >
            <h3
              ref={titleRef}
              style={{
                background: CARD_BG,
                color: GREEN,
                fontSize: 24,
                fontWeight: 900,
                lineHeight: 1,
                textTransform: "uppercase",
                marginTop: -2,
                marginBottom: -2,
                marginRight: -2,
                marginLeft: 0,
                paddingRight: 10,
                paddingBottom: 2,
                paddingLeft: 2,
                borderRadius: "0 0 6px 0",
                whiteSpace: "nowrap",
                display: "inline-block",
                ...(titleOverflow > 0 && {
                  "--marquee-tx": `-${titleOverflow}px`,
                  animation: "marquee-bounce 2.5s ease-in-out 1s infinite alternate",
                } as React.CSSProperties),
              }}
            >
              {name}
            </h3>
          </div>
          {subtitle && (
            <p
              style={{
                background: CARD_BG,
                color: GREEN,
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                margin: -2,
                paddingRight: 8,
                paddingBottom: 4,
                paddingLeft: 2,
                lineHeight: 1.3,
                borderRadius: "0 0 6px 0",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Price — fuera del overflow:hidden, bottom-left del wrapper */}
        {priceShippingInfo && (
          <p
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "90%",
              background: CARD_BG,
              color: GREEN,
              fontSize: 9,
              fontWeight: 700,
              lineHeight: 1.5,
              margin: -2,
              textTransform: "uppercase",
              whiteSpace: "pre-line",
              paddingTop: 4,
              paddingRight: 8,
              paddingLeft: 2,
              paddingBottom: 2,
              borderRadius: "0 6px 0 0",
            }}
          >
            {priceShippingInfo}
          </p>
        )}
      </div>

      {/* CTA button */}
      <Button
        variant={sold ? "secondary" : "primary"}
        withStroke={sold}
        size="sm"
        onClick={sold ? onContactClick : onBuyClick}
        className="w-full justify-center"
      >
        {sold ? contactText : buttonText}
      </Button>
    </article>
  );
}
