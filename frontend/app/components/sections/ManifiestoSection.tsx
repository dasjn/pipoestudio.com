interface ManifiestoSectionData {
  _type: "manifiestoSection";
  title?: string;
  content?: string;
  backgroundColor?: string;
}

interface ManifiestoSectionProps {
  data?: ManifiestoSectionData;
}

const DEFAULT_CONTENT =
  "EN PIPO NO HACEMOS COSAS DISTINTAS PARA LLAMAR LA ATENCIÓN. SIMPLEMENTE NO SABEMOS HACERLO DE OTRA MANERA. CREEMOS QUE LO ÚNICO ES LO NORMAL.";

export default function ManifiestoSection({ data }: ManifiestoSectionProps) {
  const content = data?.content || DEFAULT_CONTENT;

  return (
    <section
      id="manifiesto"
      className="w-full h-full flex items-center justify-center px-2"
    >
      <p className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-green-pipo">
        {content}
      </p>
    </section>
  );
}
