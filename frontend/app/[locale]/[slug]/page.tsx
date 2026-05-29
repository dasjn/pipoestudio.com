import type { Metadata, ResolvingMetadata } from "next";
import Head from "next/head";
import { type PortableTextBlock } from "@portabletext/types";

import Header from "@/app/components/sections/Header";
import PageBuilderPage from "@/app/components/PageBuilder";
import PipoPortableText from "@/app/components/PipoPortableText";
import CoverImage from "@/app/components/CoverImage";
import Button from "@/app/components/Button";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, pagesSlugs, seoPageQuery, seoPagesSlugs, cursosHeroQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { GetPageQueryResult } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";
import { i18n, type Locale } from "@/i18n.config";

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export async function generateStaticParams() {
  const [{ data: pageData }, { data: seoData }] = await Promise.all([
    sanityFetch({ query: pagesSlugs, perspective: "published", stega: false }),
    sanityFetch({ query: seoPagesSlugs, perspective: "published", stega: false }),
  ]);

  const params = [];
  for (const item of [...(pageData ?? []), ...(seoData ?? [])]) {
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
  const [{ data: page }, { data: seoPage }] = await Promise.all([
    sanityFetch({ query: getPageQuery, params: { slug: params.slug, language: params.locale }, stega: false }),
    sanityFetch({ query: seoPageQuery, params: { slug: params.slug, language: params.locale }, stega: false }),
  ]);

  if (seoPage?._id) {
    const previousImages = (await parent).openGraph?.images || [];
    const ogImage = resolveOpenGraphImage(seoPage.coverImage);
    return {
      title: seoPage.title,
      description: seoPage.metaDescription,
      openGraph: { images: ogImage ? [ogImage, ...previousImages] : previousImages },
    } satisfies Metadata;
  }

  return {
    title: page?.name,
    description: page?.heading,
  } satisfies Metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { slug, locale } = params;

  const [{ data: page }, { data: seoPage }, { data: cursosHero }] = await Promise.all([
    sanityFetch({ query: getPageQuery, params: { slug, language: locale } }),
    sanityFetch({ query: seoPageQuery, params: { slug, language: locale } }),
    sanityFetch({ query: cursosHeroQuery, params: { language: locale } }),
  ]);

  // ── Página SEO ────────────────────────────────────────────────────────────
  if (seoPage?._id) {
    const cursos = cursosHero?.sections;
    const VIDEO_W = 160;
    const VIDEO_H = Math.round(VIDEO_W * (16 / 9));

    return (
      <div className="min-h-screen bg-[#E4E5E0]">
        <Header blogMode />

        {/* ── Hero ── */}
        <section className="max-w-2xl mx-auto px-6 pt-12 pb-8 flex flex-col items-center text-center gap-6">
          {/* Marca */}
          <p className="font-sans font-bold text-green-pipo leading-none" style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}>
            Pipo estudio
          </p>

          {/* Subtítulo */}
          {seoPage.heroSubtitle && (
            <p className="font-sans font-bold text-green-pipo text-3xl lg:text-5xl leading-tight">
              {seoPage.heroSubtitle}
            </p>
          )}

          {/* Intro text */}
          {seoPage.heroIntroText && (
            <p className="font-sans font-bold text-green-pipo uppercase text-sm lg:text-base leading-snug">
              {seoPage.heroIntroText}
            </p>
          )}

          {/* Botonera */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button as="link" href={`/${locale}`} variant="primary" size="sm">
              {locale === "es" ? "Ver página principal" : "Main page"}
            </Button>
            <Button as="link" href={`/${locale}/blog`} variant="primary" size="sm">
              {locale === "es" ? "Ver mi diario" : "Read my diary"}
            </Button>
          </div>

          {/* Tarjetas de video */}
          {cursos && (
            <div className="flex gap-5 justify-center flex-wrap">
              {[
                { label: cursos.youtubeLabel ?? "EN YOUTUBE", video: cursos.youtubeVideo, href: cursos.youtubeUrl },
                { label: cursos.instagramLabel ?? "EN INSTAGRAM", video: cursos.instagramVideo, href: cursos.instagramUrl },
              ].map(({ label, video, href }) => {
                const inner = (
                  <div style={{ width: VIDEO_W }}>
                    <div className="bg-[#00A750] text-white font-bold uppercase text-[11px] px-2 py-[5px] text-center rounded-t-[4px]">
                      {label}
                    </div>
                    <div style={{ width: VIDEO_W, height: VIDEO_H, overflow: "hidden", background: "#1a1a1a", borderRadius: "0 0 4px 4px" }}>
                      {video?.url ? (
                        <video src={video.url} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#2a2a2a" }} />
                      )}
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{inner}</a>
                ) : inner;
              })}
            </div>
          )}
        </section>

        {/* ── Contenido ── */}
        <main className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="font-sans font-bold text-green-pipo text-3xl lg:text-5xl uppercase leading-none mb-8">
            {seoPage.title}
          </h1>

          {seoPage.coverImage && (
            <div className="mb-8">
              <CoverImage image={seoPage.coverImage} priority />
            </div>
          )}

          {seoPage.content?.length ? (
            <PipoPortableText value={seoPage.content as PortableTextBlock[]} />
          ) : null}

          <div className="mt-12 pt-8 border-t border-green-pipo/30 flex flex-wrap gap-3">
            <Button as="link" href={`/${locale}`} variant="primary" size="sm">
              {locale === "es" ? "Ver página principal" : "Go to main page"}
            </Button>
            <Button as="link" href={`/${locale}?section=contacto`} variant="primary" size="sm">
              {locale === "es" ? "Contacta" : "Contact"}
            </Button>
            <Button as="link" href={`/${locale}/blog`} variant="primary" size="sm">
              {locale === "es" ? "Ver mi diario" : "Read my diary"}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ── Página genérica (type: page) ──────────────────────────────────────────
  if (!page?._id) {
    return (
      <>
        <Header />
        <div className="py-40">
          <PageOnboarding />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="my-12 lg:my-24">
        <Head>
          <title>{page.heading}</title>
        </Head>
        <div className="">
          <div className="container">
            <div className="pb-6 border-b border-gray-100">
              <div className="max-w-3xl">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
                  {page.heading}
                </h2>
                <p className="mt-4 text-base lg:text-lg leading-relaxed text-gray-600 uppercase font-light">
                  {page.subheading}
                </p>
              </div>
            </div>
          </div>
        </div>
        <PageBuilderPage page={page as GetPageQueryResult} />
      </div>
    </>
  );
}
