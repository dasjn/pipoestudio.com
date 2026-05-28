import { Suspense } from "react";
import { type Locale } from "@/i18n.config";
import { sanityFetch } from "@/sanity/lib/live";
import { allPostsQuery, blogPageQuery } from "@/sanity/lib/queries";
import Header from "@/app/components/sections/Header";
import PipoBlogCard from "@/app/components/PipoBlogCard";
import Button from "@/app/components/Button";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;

  const [{ data: settings }, { data: posts }] = await Promise.all([
    sanityFetch({ query: blogPageQuery, params: { language: locale } }),
    sanityFetch({ query: allPostsQuery, params: { language: locale } }),
  ]);

  const blogTitle =
    settings?.blogTitle ?? (locale === "es" ? "Bienvenido a mi diario" : "Welcome to my diary");

  return (
    <div className="min-h-screen bg-[#E4E5E0]">
      <Header blogMode />

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Título */}
        <h1 className="font-sans font-bold text-green-pipo text-5xl lg:text-6xl text-center mb-12">
          {blogTitle}
        </h1>

        {/* Grid de posts */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {posts.map((post: any) => (
              <PipoBlogCard key={post._id} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-green-pipo text-center text-sm mb-16">
            {locale === "es" ? "Todavía no hay posts." : "No posts yet."}
          </p>
        )}

        {/* Botón volver */}
        <div className="flex justify-center">
          <Button as="link" href={`/${locale}`} variant="primary" size="sm">
            {locale === "es" ? "Ver página principal" : "Back to main page"}
          </Button>
        </div>
      </main>
    </div>
  );
}
