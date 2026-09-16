"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticWrapper } from "@/components/common/MagneticWrapper";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Menú", href: "#menu" },
  { label: "Ambiente", href: "#ambiente" },
  { label: "Insumos", href: "#insumos" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Reservas", href: "#reserva" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      if (window.scrollY < 120) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver to detect currently active section
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Select entry with highest intersection ratio or nearest
          const current = visibleEntries.reduce((prev, curr) =>
            curr.intersectionRatio > prev.intersectionRatio ? curr : prev
          );
          setActiveSection(`#${current.target.id}`);
        }
      },
      {
        rootMargin: "-25% 0px -40% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    const sectionElements = NAV_LINKS.map((l) =>
      document.querySelector(l.href)
    ).filter(Boolean) as HTMLElement[];

    sectionElements.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-warm py-3"
          : "bg-cream-soft/85 backdrop-blur-sm py-4 md:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="#"
          className="flex items-center gap-1 text-2xl font-bold font-heading tracking-tight focus-visible:ring-2 focus-visible:ring-mustard rounded-lg"
          aria-label="Limitless Sweet - Inicio"
        >
          <span className="text-ink">Limitless</span>
          <span className="text-mustard">Sweet</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-mustard font-semibold" : "text-ink hover:text-mustard"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-mustard rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <MagneticWrapper strength={0.25}>
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-button bg-mustard hover:bg-mustard-hover active:bg-mustard-dark text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-95"
            >
              Ver menú
            </a>
          </MagneticWrapper>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-ink hover:text-mustard hover:bg-yellow-light/20 transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/98 border-b border-neutral-200 shadow-lg"
          >
            <div className="px-5 pt-3 pb-6 space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`block py-2.5 px-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "text-mustard font-semibold bg-yellow-light/20"
                        : "text-ink hover:text-mustard hover:bg-cream-soft"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="pt-3">
                <a
                  href="#menu"
                  onClick={closeMobileMenu}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-button bg-mustard hover:bg-mustard-hover text-white font-medium text-base shadow-sm"
                >
                  Ver menú
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
