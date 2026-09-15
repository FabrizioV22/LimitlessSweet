import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "center" | "left";
  className?: string;
  dark?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className = "",
  dark = false,
}) => {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-10 md:mb-14 ${
        isCenter ? "text-center max-w-2xl mx-auto" : "max-w-xl"
      } ${className}`}
    >
      {eyebrow && (
        <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold tracking-wider uppercase rounded-full bg-yellow-light/60 text-coffee border border-yellow/40">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed ${
            dark ? "text-cream/80" : "text-ink-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
