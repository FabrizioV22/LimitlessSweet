import React from "react";
import { AlertCircle } from "lucide-react";

interface DietaryDisclaimerProps {
  className?: string;
  variant?: "inline" | "banner" | "footer";
}

export const DietaryDisclaimer: React.FC<DietaryDisclaimerProps> = ({
  className = "",
  variant = "footer",
}) => {
  const disclaimerText =
    "La información alimentaria mostrada es orientativa. Si tienes una alergia severa, confirma directamente con el establecimiento los ingredientes, procesos de preparación y medidas frente a contaminación cruzada antes de consumir.";

  if (variant === "banner") {
    return (
      <div
        role="note"
        aria-label="Aviso sobre alérgenos"
        className={`flex items-start gap-3 rounded-card bg-[#FDF5E6] border border-[#F3DFC1] p-4 text-ink text-sm leading-relaxed ${className}`}
      >
        <AlertCircle className="w-5 h-5 text-mustard flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p>{disclaimerText}</p>
      </div>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Aviso legal sobre alérgenos"
      className={`text-xs text-[#C2B5A5] leading-relaxed border-t border-[#544031] pt-6 mt-8 ${className}`}
    >
      <div className="flex items-start gap-2.5 max-w-4xl mx-auto">
        <AlertCircle className="w-4 h-4 text-mustard flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-left font-normal text-[#D2C5B4]">{disclaimerText}</p>
      </div>
    </aside>
  );
};
