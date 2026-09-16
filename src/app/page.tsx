import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { WhatWeOffer } from "@/components/sections/WhatWeOffer";
import { Menu } from "@/components/sections/Menu";
import { Experience } from "@/components/sections/Experience";
import { Ingredients } from "@/components/sections/Ingredients";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { ContactReservation } from "@/components/sections/ContactReservation";
import { SectionDivider } from "@/components/common/SectionDivider";

export default function HomePage() {
  return (
    <>
      {/* Accessible skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-mustard focus:text-white focus:rounded-button focus:shadow-warm text-sm font-medium"
      >
        Saltar al contenido principal
      </a>

      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Semantic Content */}
      <main id="main-content" className="flex flex-col">
        <Hero />
        <SectionDivider position="bottom" colorClass="text-cream-soft" className="-mt-10 sm:-mt-14 relative z-20" />
        <AboutUs />
        <SectionDivider position="bottom" colorClass="text-cream" className="bg-cream-soft" />
        <WhatWeOffer />
        <Menu />
        <SectionDivider position="bottom" colorClass="text-[#FAF2E5]" className="bg-cream" />
        <Experience />
        <SectionDivider position="bottom" colorClass="text-cream" className="bg-[#FAF2E5]" flipX />
        <Ingredients />
        <Testimonials />
        <SectionDivider position="bottom" colorClass="text-white" className="bg-cream/70" />
        <FAQ />
        <SectionDivider position="bottom" colorClass="text-cream-soft" className="bg-white" flipX />
        <ContactReservation />
        <SectionDivider position="bottom" colorClass="text-coffee-dark" className="bg-cream-soft" />
      </main>

      {/* Site Footer */}
      <Footer />
    </>
  );
}
