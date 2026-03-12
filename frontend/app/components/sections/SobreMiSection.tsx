interface SobreMiSectionData {
  _type: "SobreMiSection";
  statement?: string;
}

interface SobreMiSectionProps {
  data?: SobreMiSectionData;
}

const DEFAULT_STATEMENT =
  "EN PIPO NO HACEMOS COSAS DISTINTAS PARA LLAMAR LA ATENCIÓN. SIMPLEMENTE NO SABEMOS HACERLO DE OTRA MANERA. CREEMOS QUE LO ÚNICO ES LO NORMAL.";

export default function SobreMiSection({ data }: SobreMiSectionProps) {
  const statement = data?.statement || DEFAULT_STATEMENT;

  return (
    <section
      id="sobreMi"
      className="w-full h-full flex items-center justify-center px-6"
    >
      <p className="font-sans font-bold text-[80px] leading-none tracking-normal text-center text-green-pipo">
        {statement}
      </p>
    </section>
  );
}
