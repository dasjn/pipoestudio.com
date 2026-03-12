import Button from "@/app/components/Button";

interface TrabajosSectionData {
  _type: "trabajosSection";
  statement?: string;
  buttonText?: string;
  buttonUrl?: string;
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
      className="w-full h-full flex flex-col items-center justify-start gap-2 px-2"
    >
      <p className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-green-pipo">
        {statement}
      </p>

      {data?.buttonText && data?.buttonUrl && (
        <Button as="link" href={data.buttonUrl} variant="primary" size="sm">
          {data.buttonText}
          <span
            className="material-symbols-outlined "
            style={{ fontSize: "16px" }}
            aria-hidden="true"
          >
            {"rotate_right"}
          </span>
        </Button>
      )}
    </section>
  );
}
