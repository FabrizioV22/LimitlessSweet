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
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Semantic Content */}
      <main id="main-content" className="flex flex-col">
        <Hero />
        <SectionDivider
          position="bottom"
          colorClass="text-cream-soft"
          className="-mt-10 sm:-mt-14 relative z-10"
        />
        <AboutUs />
        <WhatWeOffer />
        <SectionDivider
          position="bottom"
          colorClass="text-white"
          className="bg-cream-soft"
        />
        <Menu />
        <SectionDivider
          position="bottom"
          colorClass="text-cream-soft"
          className="bg-white"
          flipX
        />
        <Experience />
        <SectionDivider
          position="bottom"
          colorClass="text-white"
          className="bg-cream-soft"
        />
        <Ingredients />
        <SectionDivider
          position="bottom"
          colorClass="text-cream-soft"
          className="bg-white"
          flipX
        />
        <Testimonials />
        <SectionDivider
          position="bottom"
          colorClass="text-white"
          className="bg-cream-soft"
        />
        <FAQ />
        <SectionDivider
          position="bottom"
          colorClass="text-cream-soft"
          className="bg-white"
          flipX
        />
        <ContactReservation />
        <SectionDivider
          position="bottom"
          colorClass="text-coffee-dark"
          className="bg-cream-soft"
        />
      </main>

      {/* Site Footer */}
      <Footer />
    </>
  );
}
