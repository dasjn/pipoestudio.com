import Image from "next/image";

interface FooterSectionData {
  _type: "footerSection";
  heading?: string;
  captionText?: string;
  captionUrl?: string;
}

interface Props {
  data?: FooterSectionData;
  mobile?: boolean;
}

export default function Footer({ data, mobile = false }: Props) {
  const heading = data?.heading || "LO ÚNICO ES LO NORMAL";
  const captionText = data?.captionText || "Made for Pipo with love byfugu";
  const captionUrl = data?.captionUrl || "https://www.byfugu.com";

  return (
    <footer className="w-full h-full flex flex-col items-center justify-center pt-[10%]">
      <p
        className="font-bold text-green-pipo text-3xl text-center uppercase leading-tight mb-4"
        style={mobile ? { maxWidth: "60vw" } : undefined}
      >
        {heading}
      </p>

      <Image
        src="/images/Pipo_Imagen_Footer.webp"
        alt="Pipo"
        width={900}
        height={900}
        className="w-auto object-contain"
        style={{ maxHeight: mobile ? "45%" : "70%" }}
        priority
      />

      <a
        href={captionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-bold text-green-pipo text-center hover:underline mt-1"
      >
        {captionText}
      </a>
    </footer>
  );
}
