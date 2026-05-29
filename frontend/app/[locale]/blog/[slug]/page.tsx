import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { type PortableTextBlock } from "@portabletext/types";
import { Suspense } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { postPagesSlugs, postQuery, blogPageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { i18n, type Locale } from "@/i18n.config";
import Header from "@/app/components/sections/Header";
import PipoPortableText from "@/app/components/PipoPortableText";
import CoverImage from "@/app/components/CoverImage";
import Button from "@/app/components/Button";

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPagesSlugs,
    perspective: "published",
    stega: false,
  });

  const params = [];
  for (const item of data ?? []) {
    for (const locale of i18n.locales) {
      params.push({ slug: item.slug, locale });
    }
  }
  return params;
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: postQuery,
    params: { slug: params.slug, language: params.locale },
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const [{ data: post }, { data: settings }] = await Promise.all([
    sanityFetch({ query: postQuery, params: { slug, language: locale } }),
    sanityFetch({ query: blogPageQuery, params: { language: locale } }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#E4E5E0]">
      <Header blogMode />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Volver al blog */}
        <a
          href={`/${locale}/blog`}
          className="font-sans text-sm text-green-pipo underline hover:no-underline mb-8 inline-block"
        >
          ← {locale === "es" ? "Volver al blog" : "Back to blog"}
        </a>

        {/* Título del post */}
        <h1 className="font-sans font-bold text-green-pipo text-5xl lg:text-7xl uppercase leading-none mb-8">
          {post.title}
        </h1>

        {/* Imagen de portada */}
        {post.coverImage && (
          <div className="mb-8">
            <CoverImage image={post.coverImage} priority />
          </div>
        )}

        {/* Contenido */}
        {post.content?.length && (
          <PipoPortableText value={post.content as PortableTextBlock[]} />
        )}

        {/* Footer del post */}
        <div className="mt-12 pt-8 border-t border-green-pipo/30 flex flex-col items-center gap-8">
          <p className="font-sans font-extrabold text-green-pipo uppercase text-center"
             style={{ fontSize: '61px', lineHeight: '73px' }}>
            {settings?.blogPostClosing ?? (locale === "es" ? "¡Cuéntame tu próximo proyecto!" : "Tell me about your next project!")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button as="link" href={`/${locale}?section=contacto`} variant="primary" size="sm">
              {locale === "es" ? "Contacta" : "Contact"}
            </Button>
            <Button as="link" href={`/${locale}`} variant="primary" size="sm">
              {locale === "es" ? "Ver página principal" : "Go to main page"}
            </Button>
            <Button as="link" href={`/${locale}/blog`} variant="primary" size="sm">
              {locale === "es" ? "Más artículos" : "More articles"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
