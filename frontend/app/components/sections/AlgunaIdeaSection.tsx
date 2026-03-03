interface AlgunaIdeaSectionData {
  _type: "algunaIdeaSection";
  title?: string;
  description?: string;
  backgroundColor?: string;
}

interface AlgunaIdeaSectionProps {
  data?: AlgunaIdeaSectionData;
}

export default function AlgunaIdeaSection({ data }: AlgunaIdeaSectionProps) {
  const content = {
    title: data?.title || "¿Alguna idea?",
    description: data?.description || "¿Tienes alguna idea? ¡Contáctanos!",
    backgroundColor: data?.backgroundColor || "bg-purple-200",
  };

  return (
    <section
      id="algunaIdea"
      className="w-full h-full flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="text-lg">{content.description}</p>
      </div>
    </section>
  );
}
