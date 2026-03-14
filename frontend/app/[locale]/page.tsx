import Header from "@/app/components/sections/Header";
import {
  settingsQuery,
  allPostsQuery,
  homeQuery,
  featuredProductsQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { i18n, type Locale } from "@/i18n.config";
import { InicioSection, PlaygroundSection } from "../components/sections";
import ThreeDCanvas from "../components/ThreeDCanvas";
import PipoChat from "../components/PipoChat";
import type { SectionsData } from "../components/Shelves";

function findSectionData(sections: any[], type: string) {
  return sections?.find((s: any) => s._type === type);
}

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  const [
    { data: settings },
    { data: posts },
    { data: home },
    { data: products },
  ] = await Promise.all([
    sanityFetch({ query: settingsQuery }),
    sanityFetch({ query: allPostsQuery, params: { language: locale } }),
    sanityFetch({ query: homeQuery, params: { language: locale } }),
    sanityFetch({
      query: featuredProductsQuery,
      params: { language: locale, limit: 3 },
    }),
  ]);

  const sanitySections = home?.sections ?? [];

  const sectionsData: SectionsData = {
    inicio: findSectionData(sanitySections, "inicioSection"),
    manifiesto: findSectionData(sanitySections, "manifiestoSection"),
    trabajos: findSectionData(sanitySections, "trabajosSection"),
    algunaIdea: findSectionData(sanitySections, "algunaIdeaSection"),
    cursos: findSectionData(sanitySections, "cursosSection"),
    sobreMi: findSectionData(sanitySections, "SobreMiSection"),
    tienda: findSectionData(sanitySections, "tiendaSection"),
    contacto: findSectionData(sanitySections, "contactoSection"),
    posts: posts ?? [],
    products: products ?? [],
  };

  return (
    <>
      <Header />
      <InicioSection data={sectionsData.inicio} />
      <PlaygroundSection />
      <ThreeDCanvas sectionsData={sectionsData} />
      <PipoChat />
    </>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}
