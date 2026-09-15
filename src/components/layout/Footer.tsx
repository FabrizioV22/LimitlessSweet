import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin, Instagram, Facebook } from "lucide-react";
import { DietaryDisclaimer } from "@/components/common/DietaryDisclaimer";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-coffee-dark text-cream pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#4E392B]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="flex flex-col">
            <Link
              href="#"
              className="text-2xl font-bold font-heading tracking-tight mb-4 inline-block"
            >
              <span className="text-white">Limitless</span>
              <span className="text-yellow">Sweet</span>
            </Link>
            <p className="text-sm text-[#D7C9BA] leading-relaxed mb-6">
              Cafetería temática especializada en postres para personas con alergias e intolerancias alimentarias.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="h-11 w-11 min-w-[44px] min-h-[44px] rounded-full bg-[#523D2F] hover:bg-mustard text-cream flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Facebook"
                className="h-11 w-11 min-w-[44px] min-h-[44px] rounded-full bg-[#523D2F] hover:bg-mustard text-cream flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en TikTok"
                className="h-11 w-11 min-w-[44px] min-h-[44px] rounded-full bg-[#523D2F] hover:bg-mustard text-cream flex items-center justify-center transition-colors duration-200 text-xs font-bold"
              >
                TK
              </a>
            </div>
          </div>

          {/* Location Col */}
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-white font-heading mb-4">
              Ubicación
            </h3>
            <p className="flex items-start gap-2 text-sm text-[#D7C9BA] mb-4">
              <MapPin className="w-4 h-4 text-mustard flex-shrink-0 mt-0.5" />
              <span>Av. José Larco 743, Miraflores, Lima</span>
            </p>
            <div className="relative aspect-[16/9] w-full max-w-[240px] rounded-xl overflow-hidden border border-[#5E4839] shadow-inner bg-[#342419]">
              <Image
                src="/images/footer-map.png"
                alt="Mapa de ubicación Limitless Sweet"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Opening Hours Col */}
          <div>
            <h3 className="text-base font-semibold text-white font-heading mb-4">
              Horarios
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D7C9BA]">
              <li className="flex justify-between pb-1 border-b border-[#523D2F]/60">
                <span>Lunes - Viernes</span>
                <span className="font-medium text-white">8:00 - 20:00</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-[#523D2F]/60">
                <span>Sábados</span>
                <span className="font-medium text-white">9:00 - 21:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingos</span>
                <span className="font-medium text-white">10:00 - 18:00</span>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-base font-semibold text-white font-heading mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-[#D7C9BA]">
              <li>
                <a
                  href="tel:+51987654321"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-mustard flex-shrink-0" />
                  <span>+51 987 654 321</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@limitlesssweet.pe"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-mustard flex-shrink-0" />
                  <span>hola@limitlesssweet.pe</span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/51987654321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] gap-2 px-4 py-2.5 rounded-button bg-mustard hover:bg-mustard-hover text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Escríbenos por WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Dietary Disclaimer (Rule non-negotiable) */}
        <DietaryDisclaimer variant="footer" />

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#544031] text-center text-xs text-[#A89886]">
          <p>© 2026 Limitless Sweet. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
