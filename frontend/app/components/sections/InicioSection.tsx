"use client";
import { useLocaleStore } from "@/app/store/localeStore";
import { useNavigationStore } from "@/app/store/navigationStore";
import PipoLogo from "@/app/components/PipoLogo";
import Button from "@/app/components/Button";
import { AnimatePresence, motion } from "framer-motion";

const STRINGS = {
  es: { cta: "CREEMOS ALGO ÚNICO" },
  en: { cta: "LET'S CREATE SOMETHING UNIQUE" },
};

interface InicioSectionData {
  _type: "inicioSection";
  title?: string;
  subtitle1?: string;
  subtitle2?: string;
  highlightedWord?: string;
  subtitle3?: string;
  location?: string;
}

interface InicioSectionProps {
  data?: InicioSectionData;
  mobile?: boolean;
}

export default function InicioSection({ data, mobile = false }: InicioSectionProps) {
  const locale = useLocaleStore((state) => state.locale);
  const { currentSection, navigateToSection } = useNavigationStore();
  const t = STRINGS[locale] ?? STRINGS.es;

  // Default content if no data is provided
  const content = {
    title: data?.title || "Pipo",
    subtitle1: data?.subtitle1 || "MUEBLES",
    subtitle2: data?.subtitle2 || "ARTESANALES",
    highlightedWord: data?.highlightedWord || "ÚNICOS",
    subtitle3: data?.subtitle3 || "HECHOS",
    location: data?.location || "EN CANARIAS",
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen bg-transparent flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-16 pointer-events-none"
    >
      <AnimatePresence>
        {currentSection === "inicio" && (
          <motion.div
            key="inicio-content"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <h1
              className={`font-bold text-green-pipo flex flex-col items-center uppercase ${mobile ? "" : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"}`}
              style={mobile ? { fontSize: "clamp(2rem, 11vw, 3rem)", lineHeight: 1 } : undefined}
            >
              <PipoLogo className="block mt-10 mb-10 h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 w-auto" fill="currentColor" />
              <span className="block">{content.subtitle1}</span>
              <span className="block">{content.subtitle2}</span>
              <span className="flex items-center gap-2 sm:gap-4">
                <span className="text-clean-gray bg-green-pipo px-2 sm:px-3 sm:pt-4 pt-2 pb-1 inline-block rotate-3 rounded-lg">
                  {content.highlightedWord}
                </span>
                <span>{content.subtitle3}</span>
              </span>
              <span className="block">{content.location}</span>
            </h1>

            <div className="mt-6 pointer-events-auto">
              <Button
                as="button"
                size="sm"
                onClick={() => {
                  if (mobile) {
                    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigateToSection("contacto", "down");
                  }
                }}
              >
                {t.cta}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
