import Header from "@/app/components/sections/Header";
import { settingsQuery, allPostsQuery, homeQuery, featuredProductsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { i18n, type Locale } from "@/i18n.config";
import Footer from "../components/sections/Footer";
import {
  InicioSection,
  ManifiestoSection,
  TrabajosSection,
  AlgunaIdeaSection,
  CursosSection,
  TiendaSection,
  ContactoSection,
  PlaygroundSection,
} from "../components/sections";
import SectionRenderer from "../components/SectionRenderer";
import Develop from "../components/sections/DevelopSection";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  const [{ data: settings }, { data: posts }, { data: home }, { data: products }] =
    await Promise.all([
      sanityFetch({ query: settingsQuery }),
      sanityFetch({ query: allPostsQuery, params: { language: locale } }),
      sanityFetch({ query: homeQuery, params: { language: locale } }),
      sanityFetch({ query: featuredProductsQuery, params: { language: locale, limit: 3 } }),
    ]);

  // Fallback sections if no Sanity content
  const fallbackSections = (
    <>
      <InicioSection />
      <ManifiestoSection />
      <TrabajosSection posts={posts || []} />
      <AlgunaIdeaSection />
      <CursosSection />
      <TiendaSection />
      <ContactoSection />
    </>
  );

  return (
    <>
      <Header />
      <Develop products={products || []} />
      <div className="relative">
        {home?.sections && home.sections.length > 0 ? (
          <SectionRenderer sections={home.sections} posts={posts || []} />
        ) : (
          fallbackSections
        )}
      </div>
      <Footer />
      <PlaygroundSection />
    </>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}
