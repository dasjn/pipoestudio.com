import Button from "../Button";
import PipoBubble from "../PipoBubble";

interface ContactoSectionData {
  title?: string;
  instagramLabel?: string;
  instagramUrl?: string;
  youtubeLabel?: string;
  youtubeUrl?: string;
  formularioLabel?: string;
  formularioUrl?: string;
  whatsappLabel?: string;
  whatsappNumber?: string;
  emailLabel?: string;
  email?: string;
  footerText?: string;
}

const DEFAULTS = {
  title: "CONTACTA",
  instagramLabel: "INSTAGRAM",
  youtubeLabel: "YOUTUBE",
  formularioLabel: "FORMULARIO DE CONTACTO",
  whatsappLabel: "WHATSAPP",
  emailLabel: "INFO@PIPOESTUDIO.COM",
  footerText:
    "PIPO. HECHO DESDE 2022\nEN ARUCAS, GRAN CANARIA,\nISLAS CANARIAS, ESPAÑA",
};

export default function ContactoSection({
  data,
  mobile = false,
}: {
  data?: ContactoSectionData;
  mobile?: boolean;
} = {}) {
  const title = data?.title ?? DEFAULTS.title;
  const instagramLabel = data?.instagramLabel ?? DEFAULTS.instagramLabel;
  const youtubeLabel = data?.youtubeLabel ?? DEFAULTS.youtubeLabel;
  const formularioLabel = data?.formularioLabel ?? DEFAULTS.formularioLabel;
  const whatsappLabel = data?.whatsappLabel ?? DEFAULTS.whatsappLabel;
  const emailLabel = data?.emailLabel ?? DEFAULTS.emailLabel;
  const footerText = data?.footerText ?? DEFAULTS.footerText;

  const whatsappHref = data?.whatsappNumber
    ? `https://wa.me/${data.whatsappNumber}`
    : "#";
  const emailHref = data?.email ? `mailto:${data.email}` : "#";

  return (
    <section
      id="contacto"
      className="relative font-sans w-full h-full flex flex-col items-center justify-center px-2 mt-6"
    >
      {!mobile && (
        <PipoBubble
          text={"Si tienes una idea\no sólo quieres saludar,\n¡escríbeme!"}
          style={{ right: "1%", top: "40%" }}
        />
      )}

      {/* Título */}
      <p
        className={`font-bold text-green-pipo uppercase leading-none text-center ${mobile ? "text-3xl" : ""}`}
        style={mobile ? { marginBottom: 16 } : { fontSize: 72, marginBottom: 12 }}
      >
        {title}
      </p>

      {/* Botones + footer */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          width: mobile ? "70vw" : "max-content",
        }}
      >
        <Button
          as="link"
          size="sm"
          href={data?.instagramUrl ?? "#"}
          target="_blank"
          className={mobile ? "w-full justify-center" : ""}
        >
          {instagramLabel}
        </Button>
        <Button
          as="link"
          size="sm"
          href={data?.youtubeUrl ?? "#"}
          target="_blank"
          className={mobile ? "w-full justify-center" : ""}
        >
          {youtubeLabel}
        </Button>
        <Button as="link" size="sm" href={data?.formularioUrl ?? "#"} className={mobile ? "w-full justify-center" : ""}>
          {formularioLabel}
        </Button>
        <Button as="link" size="sm" href={whatsappHref} target="_blank" className={mobile ? "w-full justify-center" : ""}>
          {whatsappLabel}
        </Button>
        <Button as="link" size="sm" href={emailHref} className={mobile ? "w-full justify-center" : ""}>
          {emailLabel}
        </Button>

        {/* Footer tagline */}
        {footerText && (
          <div
            style={{
              background: "rgba(228,229,224,0.85)",
              borderRadius: 6,
              padding: "8px 12px",
            }}
          >
            <p
              className="font-bold text-green-pipo uppercase text-center leading-tight"
              style={{ fontSize: 13, whiteSpace: "pre-line" }}
            >
              {footerText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
