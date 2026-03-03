interface SobreMiSectionData {
  _type: "SobreMiSection";
  title?: string;
  description?: string;
  backgroundColor?: string;
}

interface SobreMiSectionProps {
  data?: SobreMiSectionData;
}

export default function SobreMiSection({ data }: SobreMiSectionProps) {
  const content = {
    title: data?.title || "SobreMi",
    description: data?.description || "Descubre nuestros SobreMi disponibles",
    backgroundColor: data?.backgroundColor || "bg-orange-200",
  };

  return (
    <section
      id="sobreMi"
      className="w-full h-full flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="text-lg">{content.description}</p>
      </div>
    </section>
  );
}
