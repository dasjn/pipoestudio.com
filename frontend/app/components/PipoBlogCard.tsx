import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import { type Locale } from "@/i18n.config";
import Button from "@/app/components/Button";

interface PipoBlogCardProps {
  post: {
    _id: string;
    title: string | null;
    slug: string | null;
    label?: string | null;
    coverImage: any;
  };
  locale: Locale;
}

export default function PipoBlogCard({ post, locale }: PipoBlogCardProps) {
  const { title, slug, label, coverImage } = post;
  const href = `/${locale}/blog/${slug}`;
  const imageUrl = urlForImage(coverImage)
    ?.width(600)
    .height(338)
    .fit("crop")
    .url();

  return (
    <article className="border-2 border-green-pipo flex flex-col">
      {/* Banda de etiqueta */}
      <div className="bg-green-pipo px-3 py-2 text-center">
        <span className="font-sans text-clean-gray text-xs font-bold uppercase tracking-wide whitespace-nowrap">
          {label ?? "EL BLOG DE PIPO"}
        </span>
      </div>

      {/* Cuerpo de tarjeta */}
      <div className="bg-white flex flex-col flex-1 p-3 gap-3">
        <h2 className="font-sans font-bold text-green-pipo text-sm leading-tight uppercase">
          {title}
        </h2>
        {imageUrl && (
          <div className="w-full aspect-video overflow-hidden">
            <Image
              src={imageUrl}
              alt={title ?? ""}
              width={600}
              height={338}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {/* Botón CTA */}
        <Button
          as="link"
          href={href}
          variant="primary"
          size="sm"
          className="w-full rounded-none text-center normal-case "
        >
          {locale === "es" ? "Leer el blog" : "Read the post"}
        </Button>
      </div>
    </article>
  );
}
