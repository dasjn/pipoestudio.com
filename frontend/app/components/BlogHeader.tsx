"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocaleStore } from "@/app/store/localeStore";
import { getNavigationLabel } from "@/app/lib/navigation-dictionary";
import { type SectionId } from "@/app/store/navigationStore";
import { type Locale } from "@/i18n.config";

const NAV_SECTIONS: SectionId[] = [
  "inicio",
  "manifiesto",
  "trabajos",
  "algunaIdea",
  "cursos",
  "sobreMi",
  "tienda",
  "contacto",
];

export default function BlogHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLocaleStore();

  useEffect(() => {
    const pathLocale = pathname.split("/")[1] as Locale;
    if (
      pathLocale &&
      (pathLocale === "es" || pathLocale === "en") &&
      pathLocale !== locale
    ) {
      setLocale(pathLocale);
    }
  }, [pathname, locale, setLocale]);

  const toggleLanguage = () => {
    const newLocale = locale === "es" ? "en" : "es";
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    setLocale(newLocale);
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <header className="w-full bg-green-pipo sticky top-0 z-40">
      <div className="max-w-[1920px] mx-auto">
        {/* Desktop */}
        <nav className="hidden lg:flex items-center justify-end h-14 px-5 gap-10">
          {NAV_SECTIONS.map((id) => (
            <a
              key={id}
              href={`/${locale}`}
              className="text-clean-gray font-normal xl:text-2xl lg:text-xl hover:text-green-100 active:text-green-200 transition-colors text-nowrap"
            >
              {getNavigationLabel(id, locale)}
            </a>
          ))}
          <button
            onClick={toggleLanguage}
            className="text-clean-gray font-normal xl:text-2xl lg:text-xl hover:text-green-100 transition-colors cursor-pointer"
          >
            {getNavigationLabel("language", locale)}
          </button>
          <span className="text-clean-gray font-bold text-base">
            PIPO LOGO ANIMADO
          </span>
        </nav>

        {/* Mobile */}
        <nav className="lg:hidden flex items-center justify-between h-14 px-5">
          <a
            href={`/${locale}`}
            className="text-clean-gray font-normal text-sm hover:text-green-100 transition-colors"
          >
            ← {getNavigationLabel("inicio", locale)}
          </a>
          <span className="text-clean-gray font-bold text-lg">PIPO LOGO</span>
          <button
            onClick={toggleLanguage}
            className="text-clean-gray font-normal text-sm hover:text-green-100 transition-colors"
          >
            {getNavigationLabel("language", locale)}
          </button>
        </nav>
      </div>
    </header>
  );
}
