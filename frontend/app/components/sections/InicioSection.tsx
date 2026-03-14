"use client";
import { useLocaleStore } from "@/app/store/localeStore";
import { useNavigationStore } from "@/app/store/navigationStore";
import { AnimatePresence, motion } from "framer-motion";

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
}

export default function InicioSection({ data }: InicioSectionProps) {
  const locale = useLocaleStore((state) => state.locale);
  const { currentSection } = useNavigationStore();

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
            <h1 className="font-bold text-green-pipo text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl flex flex-col items-center uppercase">
              <span className="block mt-10 mb-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl capitalize">
                {content.title}
              </span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
