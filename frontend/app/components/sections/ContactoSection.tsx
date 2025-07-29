interface ContactoSectionData {
  _type: "contactoSection";
  title?: string;
  description?: string;
  backgroundColor?: string;
}

interface ContactoSectionProps {
  data?: ContactoSectionData;
}

export default function ContactoSection({ data }: ContactoSectionProps) {
  const content = {
    title: data?.title || "Contacto",
    description: data?.description || "¿Tienes alguna idea? ¡Contáctanos!",
    backgroundColor: data?.backgroundColor || "bg-purple-200",
  };

  return (
    <section
      id="contacto"
      className={`h-svh ${content.backgroundColor} flex items-center justify-center`}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        <p className="text-lg">{content.description}</p>
      </div>
    </section>
  );
}