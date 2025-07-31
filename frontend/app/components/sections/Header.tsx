"use client";
import React, { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  useNavigationStore,
  type SectionId,
} from "../../store/navigationStore";
import { useLocaleStore } from "../../store/localeStore";
import { getNavigationLabel } from "../../lib/navigation-dictionary";
import { type Locale } from "@/i18n.config";
import { useRouter, usePathname } from "next/navigation";

// Función utilitaria cn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============= NAV LINK COMPONENT =============
interface NavLinkProps {
  children: React.ReactNode;
  sectionId?: SectionId;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  type?: "scroll" | "external" | "action";
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  sectionId,
  href,
  onClick,
  isActive = false,
  className,
  type = "scroll",
}) => {
  const scrollToSection = useNavigationStore((state) => state.scrollToSection);

  const baseClasses = `
    text-clean-gray font-normal xl:text-2xl lg:text-xl
    hover:text-green-100 active:text-green-200
    transition-colors duration-200
    cursor-pointer text-nowrap
  `;

  const activeClasses = isActive ? "text-green-100 font-semibold" : "";
  const combinedClasses = cn(baseClasses, activeClasses, className);

  // Función para scroll usando el store
  const handleScrollTo = () => {
    if (sectionId) {
      scrollToSection(sectionId);
    }
    onClick?.();
  };

  // Si es un enlace externo (para páginas externas)
  if (href && type === "external") {
    return (
      <a
        href={href}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  // Para scroll y acciones usamos button
  return (
    <button
      onClick={type === "scroll" && sectionId ? handleScrollTo : onClick}
      className={combinedClasses}
      type="button"
    >
      {children}
    </button>
  );
};

// ============= MOBILE MENU COMPONENT =============
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  currentSection: SectionId | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  currentSection,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay con animación */}
      <div
        className={`fixed inset-0 bg-green-pipo transition-opacity duration-300 ${
          isAnimating ? "opacity-80" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Menu con animación slide-in usando Tailwind */}
      <div
        className={`fixed top-0 left-0 w-80 h-full bg-green-pipo shadow-xl transform transition-transform duration-300 ease-out ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-green-pipo">
          <span className="text-clean-gray font-bold text-xl">PIPO LOGO</span>
          <button
            onClick={handleClose}
            className="text-clean-gray hover:text-green-100 p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="p-5">
          <div className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                sectionId={item.sectionId}
                href={item.href}
                onClick={() => {
                  item.onClick?.();
                  handleClose();
                }}
                type={item.type}
                isActive={item.sectionId === currentSection}
                className="text-lg py-2"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

// ============= MAIN HEADER COMPONENT =============
interface NavItem {
  label: string;
  sectionId?: SectionId;
  href?: string;
  onClick?: () => void;
  type?: "scroll" | "external" | "action";
}

interface HeaderProps {
  currentPath?: string; // Para determinar qué enlace está activo
}

const Header: React.FC<HeaderProps> = ({ currentPath = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Stores
  const { sections, currentSection, initializeSections } = useNavigationStore();
  const { locale, setLocale } = useLocaleStore();

  // Auto-detectar locale desde pathname
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

  // Función para cambiar idioma
  const toggleLanguage = () => {
    const newLocale = locale === "es" ? "en" : "es";
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, "");
    const newPath = `/${newLocale}${currentPathWithoutLocale}`;
    setLocale(newLocale);
    router.push(newPath);
  };

  // Inicializar el store cuando el componente se monta
  useEffect(() => {
    initializeSections();
  }, [initializeSections]);

  // Configuración de navegación usando el store y diccionario i18n
  const navItems: NavItem[] = [
    ...sections
      .filter((section) => section.id !== "postFooter") // Excluir postFooter del header
      .map((section) => ({
        label: getNavigationLabel(section.id, locale),
        sectionId: section.id,
        type: "scroll" as const,
      })),
    {
      label: getNavigationLabel("language", locale),
      onClick: toggleLanguage,
      type: "action" as const,
    },
  ];

  const handleAnimatedLogoClick = () => {
    // Acción para el logo animado
    console.log("Logo animado clicked");
  };

  return (
    <>
      {/* Header Principal */}
      <header className="w-full bg-green-pipo sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-end h-14 px-5">
            <div className="flex items-center space-x-10">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  sectionId={item.sectionId}
                  href={item.href}
                  onClick={item.onClick}
                  type={item.type}
                  isActive={item.sectionId === currentSection}
                >
                  {item.label}
                </NavLink>
              ))}

              {/* PIPO LOGO ANIMADO */}
              <button
                onClick={handleAnimatedLogoClick}
                className="text-clean-gray font-bold text-base hover:text-green-100 transition-colors"
              >
                PIPO LOGO ANIMADO
              </button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <nav className="lg:hidden flex items-center justify-between h-14 px-5">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-clean-gray hover:text-green-100 p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo Mobile */}
            <span className="text-clean-gray font-bold text-lg">PIPO LOGO</span>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        currentSection={currentSection}
      />
    </>
  );
};

export default Header;
