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
        <AboutUs />
        <WhatWeOffer />
        <Menu />
        <Experience />
        <Ingredients />
        <Testimonials />
        <FAQ />
        <ContactReservation />
      </main>

      {/* Site Footer */}
      <Footer />
    </>
  );
}
