interface ManifiestoSectionData {
  _type: "manifiestoSection";
  title?: string;
  content?: string;
  backgroundColor?: string;
}

interface ManifiestoSectionProps {
  data?: ManifiestoSectionData;
}

export default function ManifiestoSection({ data }: ManifiestoSectionProps) {
  const content = {
    title: data?.title || "Nuestro Manifiesto",
    content: data?.content || "Aquí va el contenido del manifiesto",
    backgroundColor: data?.backgroundColor || "bg-blue-200",
  };

  return (
    <section
      id="manifiesto"
      className={`h-svh bg-transparent flex items-center justify-center`}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="text-lg">{content.content}</p>
      </div>
    </section>
  );
}
