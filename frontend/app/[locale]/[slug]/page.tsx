import type { Metadata } from "next";
import Head from "next/head";

import Header from "@/app/components/sections/Header";
import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, pagesSlugs } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";
import { i18n, type Locale } from "@/i18n.config";

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });

  // Generate params for each locale and slug combination
  const params = [];
  for (const item of data || []) {
    for (const locale of i18n.locales) {
      if (item.language === locale) {
        params.push({ slug: item.slug, locale });
      }
    }
  }
  return params;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { slug: params.slug, language: params.locale },
    // Metadata should never contain stega
    stega: false,
  });

  return {
    title: page?.name,
    description: page?.heading,
  } satisfies Metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const [{ data: page }] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: { slug: params.slug, language: params.locale },
    }),
  ]);

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
