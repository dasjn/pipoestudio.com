"use client";
import Button from "../Button";
import { useNavigationStore } from "@/app/store/navigationStore";

interface CursosSectionData {
  _type: "cursosSection";
  title?: string;
  youtubeLabel?: string;
  instagramLabel?: string;
  youtubeVideo?: { url: string };
  youtubeUrl?: string;
  instagramVideo?: { url: string };
  instagramUrl?: string;
  presencialLabel?: string;
  presencialTitle?: string;
  presencialHighlight?: string;
  presencialInfo?: string;
  presencialButtonText?: string;
  presencialUrl?: string;
}

interface CursosSectionProps {
  data?: CursosSectionData;
  mobile?: boolean;
}

const VIDEO_W = 160;
const VIDEO_H = Math.round(VIDEO_W * (16 / 9)); // ~284px — 9:16 vertical
const PRESENCIAL_W = 250; // más ancha que las video cards

function VideoCard({
  label,
  video,
  href,
}: {
  label: string;
  video?: { url: string };
  href?: string;
}) {
  const inner = (
    <div className="flex flex-col" style={{ width: VIDEO_W }}>
      <div
        className="bg-[#00A750] text-white font-bold uppercase text-[11px] px-2 py-[5px] text-center"
        style={{ borderRadius: "4px 4px 0 0" }}
      >
        {label}
      </div>
      <div
        style={{
          width: VIDEO_W,
          height: VIDEO_H,
          overflow: "hidden",
          background: "#1a1a1a",
          borderRadius: "0 0 4px 4px",
        }}
      >
        {video?.url ? (
          <video
            src={video.url}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{ width: "100%", height: "100%", background: "#2a2a2a" }}
          />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }
  return inner;
}

function PresencialCard({
  label,
  title,
  highlight,
  info,
  buttonText,
  buttonUrl,
  onButtonClick,
}: {
  label: string;
  title?: string;
  highlight?: string;
  info?: string;
  buttonText?: string;
  buttonUrl?: string;
  onButtonClick?: () => void;
}) {
  return (
    <div
      style={{ width: PRESENCIAL_W, display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div
        className="font-sans bg-green-pipo text-white font-bold uppercase text-[11px] px-2 py-[5px] text-center"
        style={{ borderRadius: "4px 4px 0 0" }}
      >
        {label}
      </div>
      {/* Body */}
      <div
        style={{
          background: "#E4E5E0",
          padding: "8px 8px 6px 8px",
          height: VIDEO_H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "0 0 4px 4px",
        }}
      >
        {/* Top: título */}
        {title && (
          <p
            className="font-sans font-bold text-green-pipo uppercase"
            style={{ fontSize: 24, lineHeight: 1.05 }}
          >
            {title}
          </p>
        )}
        {/* Bottom: descripción + botón */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(highlight || info) && (
            <p
              className="font-sans text-green-pipo"
              style={{ fontSize: 12, lineHeight: 1.35 }}
            >
              {highlight && <strong>{highlight} </strong>}
              {info}
            </p>
          )}
          {buttonText && (
            onButtonClick ? (
              <Button as="button" size="sm" className="w-full normal-case" onClick={onButtonClick}>
                {buttonText}
              </Button>
            ) : (
              <Button as="link" href={buttonUrl ?? "#"} target="_blank" size="sm" className="w-full normal-case">
                {buttonText}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tarjeta móvil (sin interacción en el cuerpo, botón separado abajo) ────────

function MobileCard({
  label,
  video,
  children,
  buttonText,
  buttonUrl,
  onButtonClick,
}: {
  label: string;
  video?: { url: string };
  children?: React.ReactNode;
  buttonText?: string;
  buttonUrl?: string;
  onButtonClick?: () => void;
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: "70vw",
        height: "55vh",
        scrollSnapAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tarjeta */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: 6,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header verde */}
        <div className="bg-green-pipo text-white font-sans font-bold uppercase text-xs text-center py-2 px-2 flex-shrink-0">
          {label}
        </div>
          {/* Contenido */}
        <div className="flex-1 relative min-h-0 flex flex-col" style={{ background: video?.url ? "#1a1a1a" : "#E4E5E0" }}>
          {video?.url && (
            <video
              src={video.url}
              autoPlay
              loop
              muted
              playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {!video?.url && children && (
            <div className="flex-1 p-3 flex flex-col justify-between min-h-0" style={{ paddingBottom: "60px" }}>
              {children}
            </div>
          )}
          {/* Botón dentro de la tarjeta, pegado al fondo */}
          {buttonText && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "0 12px 12px 12px" }}>
              {onButtonClick ? (
                <Button as="button" size="sm" className="w-full" onClick={onButtonClick}>
                  {buttonText}
                </Button>
              ) : (
                <Button as="link" href={buttonUrl ?? "#"} target="_blank" size="sm" className="w-full">
                  {buttonText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CursosSection({ data, mobile = false }: CursosSectionProps) {
  const navigateToSection = useNavigationStore((s) => s.navigateToSection);
  const setIdeaPrefill = useNavigationStore((s) => s.setIdeaPrefill);

  const handlePresencialClick = () => {
    setIdeaPrefill(`¡Hola! Me gustaría apuntarme al próximo curso presencial. `);
    if (mobile) {
      document.getElementById("algunaIdea")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigateToSection("algunaIdea", "up");
    }
  };

  const title = data?.title ?? "APRENDE CON PIPO";
  const youtubeLabel = data?.youtubeLabel ?? "EN YOUTUBE";
  const instagramLabel = data?.instagramLabel ?? "EN INSTAGRAM";
  const presencialLabel = data?.presencialLabel ?? "EN PERSONA";
  const presencialTitle =
    data?.presencialTitle ?? "PRÓXIMO CURSO: 13→15 DE NOVIEMBRE DE 2026";
  const presencialHighlight = data?.presencialHighlight ?? "150€/persona.";
  const presencialInfo =
    data?.presencialInfo ??
    "Materiales y herramientas incluidos. Crea y llévate tu propia pieza.";
  const presencialButtonText = data?.presencialButtonText ?? "Me apunto!";

  if (mobile) {
    return (
      <section
        id="cursos"
        className="w-full h-full flex flex-col justify-center gap-5 items-center"
      >
        <p className="font-sans font-bold text-3xl leading-none tracking-normal text-center text-green-pipo px-12">
          {title}
        </p>

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
          <MobileCard
            label={youtubeLabel}
            video={data?.youtubeVideo}
            buttonText={data?.youtubeLabel ?? "Ver en YouTube"}
            buttonUrl={data?.youtubeUrl}
          />
          <MobileCard
            label={instagramLabel}
            video={data?.instagramVideo}
            buttonText={data?.instagramLabel ?? "Ver en Instagram"}
            buttonUrl={data?.instagramUrl}
          />
          <MobileCard
            label={presencialLabel}
            buttonText={presencialButtonText}
            buttonUrl={data?.presencialUrl}
            onButtonClick={handlePresencialClick}
          >
            <p
              className="font-sans font-bold text-green-pipo uppercase"
              style={{ fontSize: 24, lineHeight: 1.1 }}
            >
              {presencialTitle}
            </p>
            <p
              className="font-sans text-green-pipo"
              style={{ fontSize: 15, lineHeight: 1.4 }}
            >
              {presencialHighlight && <strong>{presencialHighlight} </strong>}
              {presencialInfo}
            </p>
          </MobileCard>
        </div>
      </section>
    );
  }

  return (
    <section
      id="cursos"
      className="w-full h-full flex flex-col items-center justify-center px-2 gap-2"
    >
      <p className="font-sans font-bold text-5xl leading-none tracking-normal text-center text-green-pipo mt-12">
        {title}
      </p>

      <div className="flex gap-5 justify-center">
        <VideoCard
          label={youtubeLabel}
          video={data?.youtubeVideo}
          href={data?.youtubeUrl}
        />
        <VideoCard
          label={instagramLabel}
          video={data?.instagramVideo}
          href={data?.instagramUrl}
        />
        <PresencialCard
          label={presencialLabel}
          title={presencialTitle}
          highlight={presencialHighlight}
          info={presencialInfo}
          buttonText={presencialButtonText}
          buttonUrl={data?.presencialUrl}
          onButtonClick={handlePresencialClick}
        />
      </div>
    </section>
  );
}
