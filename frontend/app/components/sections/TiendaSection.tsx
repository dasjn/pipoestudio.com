interface TiendaSectionData {
  _type: "tiendaSection";
  title?: string;
  description?: string;
  backgroundColor?: string;
}

interface TiendaSectionProps {
  data?: TiendaSectionData;
}

export default function TiendaSection({ data }: TiendaSectionProps) {
  const content = {
    title: data?.title || "Tienda",
    description: data?.description || "Explora nuestros productos",
    backgroundColor: data?.backgroundColor || "bg-green-200",
  };

  return (
    <section
      id="tienda"
      className="w-full h-full flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="text-lg">{content.description}</p>
      </div>
    </section>
  );
}
