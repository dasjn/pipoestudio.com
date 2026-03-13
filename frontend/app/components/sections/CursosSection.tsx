interface CursosSectionData {
  _type: "cursosSection";
  title?: string;
  youtubeLabel?: string;
  instagramLabel?: string;
  youtubeVideo?: { url: string };
  youtubeUrl?: string;
  instagramVideo?: { url: string };
  instagramUrl?: string;
}

interface CursosSectionProps {
  data?: CursosSectionData;
}

const VIDEO_W = 160;
const VIDEO_H = Math.round(VIDEO_W * (16 / 9)); // ~284px — 9:16 vertical

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
          <div style={{ width: "100%", height: "100%", background: "#2a2a2a" }} />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        {inner}
      </a>
    );
  }
  return inner;
}

export default function CursosSection({ data }: CursosSectionProps) {
  const title = data?.title ?? "APRENDE CON PIPO";
  const youtubeLabel = data?.youtubeLabel ?? "EN YOUTUBE";
  const instagramLabel = data?.instagramLabel ?? "EN INSTAGRAM";

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
      </div>
    </section>
  );
}
