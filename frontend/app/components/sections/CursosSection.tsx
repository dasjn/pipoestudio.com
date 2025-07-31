interface CursosSectionData {
  _type: "cursosSection";
  title?: string;
  description?: string;
  backgroundColor?: string;
}

interface CursosSectionProps {
  data?: CursosSectionData;
}

export default function CursosSection({ data }: CursosSectionProps) {
  const content = {
    title: data?.title || "Cursos",
    description: data?.description || "Descubre nuestros cursos disponibles",
    backgroundColor: data?.backgroundColor || "bg-orange-200",
  };

  return (
    <section
      id="cursos"
      className={`h-svh bg-transparent flex items-center justify-center`}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="text-lg">{content.description}</p>
      </div>
    </section>
  );
}
