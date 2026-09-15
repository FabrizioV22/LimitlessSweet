import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
}) => {
  return (
    <article className="flex flex-col h-full bg-white rounded-card shadow-warm p-6 md:p-7 border border-[#F3EADA]/60 transition-all duration-300">
      <div className="flex items-center gap-3.5 mb-4">
        <div className="relative h-13 w-13 h-[52px] w-[52px] overflow-hidden rounded-full ring-2 ring-yellow-light">
          <Image
            src={testimonial.avatar}
            alt={`Foto de ${testimonial.name}`}
            fill
            sizes="52px"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-base font-bold text-ink leading-snug">
            {testimonial.name}
          </h3>
          <p className="text-xs font-medium text-ink-subtle">
            {testimonial.context}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3" aria-label={`Calificación: ${testimonial.rating} de 5 estrellas`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? "fill-yellow text-yellow"
                : "text-neutral-200"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="text-sm md:text-[15px] text-ink-muted leading-relaxed italic mt-auto">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
    </article>
  );
};
