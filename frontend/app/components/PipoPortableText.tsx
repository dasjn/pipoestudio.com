import { PortableText, type PortableTextComponents } from "next-sanity";
import { type PortableTextBlock } from "@portabletext/types";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import ResolvedLink from "@/app/components/ResolvedLink";

export default function PipoPortableText({
  value,
  className,
}: {
  value: PortableTextBlock[];
  className?: string;
}) {
  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="font-sans font-bold text-4xl lg:text-5xl text-green-pipo uppercase leading-none mb-4 mt-8 first:mt-0">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="font-sans font-bold text-xl lg:text-2xl text-green-pipo uppercase leading-tight mb-3 mt-6 first:mt-0">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="font-sans font-bold text-base text-green-pipo uppercase mb-2 mt-5 first:mt-0">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="font-sans font-bold text-sm text-green-pipo uppercase mb-2 mt-4 first:mt-0">
          {children}
        </h4>
      ),
      normal: ({ children }) => (
        <p className="font-sans text-sm text-green-pipo leading-relaxed mb-2">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="font-sans text-sm text-green-pipo italic border-l-4 border-green-pipo pl-4 my-3">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="font-sans text-sm text-green-pipo">{children}</li>
      ),
      number: ({ children }) => (
        <li className="font-sans text-sm text-green-pipo">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value: link }) => (
        <ResolvedLink
          link={link}
          className="underline hover:no-underline text-green-pipo"
        >
          {children}
        </ResolvedLink>
      ),
    },
    types: {
      image: ({ value }) => {
        const imageUrl = urlForImage(value)?.width(1200).url();
        if (!imageUrl) return null;
        return (
          <figure className="my-6">
            <Image
              src={imageUrl}
              alt={value.alt ?? ""}
              width={1200}
              height={675}
              className="w-full h-auto"
            />
            {value.caption && (
              <figcaption className="font-sans text-xs text-green-pipo italic mt-2 text-center opacity-75">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return (
    <div className={className}>
      <PortableText components={components} value={value} />
    </div>
  );
}
