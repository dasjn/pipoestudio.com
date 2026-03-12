interface TrabajosSectionData {
  _type: "trabajosSection";
  statement?: string;
  fotos?: { url: string }[];
}

interface TrabajosSectionProps {
  data?: TrabajosSectionData;
}

const DEFAULT_STATEMENT = "PROYECTOS QUE HABLAN POR SÍ SOLOS.";

export default function TrabajosSection({ data }: TrabajosSectionProps) {
  const statement = data?.statement || DEFAULT_STATEMENT;

  return (
    <section
      id="trabajos"
      className="w-full h-full flex items-start justify-center px-2"
    >
      <p className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-green-pipo">
        {statement}
      </p>
    </section>
  );
}
