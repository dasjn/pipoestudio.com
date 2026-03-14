import Button from "../Button";

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
}

const VIDEO_W = 160;
const VIDEO_H = Math.round(VIDEO_W * (16 / 9)); // ~284px — 9:16 vertical
const PRESENCIAL_W = 200; // más ancha que las video cards

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
}: {
  label: string;
  title?: string;
  highlight?: string;
  info?: string;
  buttonText?: string;
  buttonUrl?: string;
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
            <Button
              as="link"
              href={buttonUrl ?? "#"}
              target="_blank"
              size="sm"
              className="w-full normal-case"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CursosSection({ data }: CursosSectionProps) {
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
        />
      </div>
    </section>
  );
}
