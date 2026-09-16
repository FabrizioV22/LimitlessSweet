"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  ShieldCheck,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { ReservationFormData } from "@/types";
import { SectionTitle } from "@/components/common/SectionTitle";
import { cn } from "@/lib/utils";

export interface ContactReservationProps {
  onSuccess?: (data: ReservationFormData) => void;
}

const reservationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Ingresa tu nombre completo (mínimo 2 caracteres)"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .min(7, "Ingresa un número telefónico válido (ej. +51 987 654 321 o 987 654 321)"),
  date: z
    .string()
    .min(1, "Selecciona una fecha para tu reserva")
    .refine((val) => {
      if (!val) return false;
      const selected = new Date(val + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "La fecha debe ser hoy o una fecha futura"),
  time: z
    .string()
    .min(1, "Selecciona una hora dentro de nuestros horarios de atención"),
  guests: z.coerce
    .number({ invalid_type_error: "Indica el número de personas" })
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1 persona")
    .max(20, "Para grupos mayores a 20 personas, por favor contáctanos por WhatsApp"),
  dietaryNotes: z
    .string()
    .max(500, "Las notas no pueden superar los 500 caracteres")
    .optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

export const ContactReservation: React.FC<ContactReservationProps> = ({
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedData, setConfirmedData] =
    useState<ReservationFormData | null>(null);

  // Minimum date allowed is today
  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
      dietaryNotes: "",
    },
    mode: "onBlur",
  });

  const dietaryNotesValue = watch("dietaryNotes") || "";

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setConfirmedData(null);
    reset();
  }, [reset]);

  // Escape key listener for accessible modal closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleCloseModal]);

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D98E4A", "#F4C542", "#7A8B5A", "#C8795A", "#B06E30"],
      });
    } catch {
      // Graceful fallback if confetti cannot run in test environment
    }

    const reservationPayload: ReservationFormData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      dietaryNotes: data.dietaryNotes,
    };

    setConfirmedData(reservationPayload);
    setIsModalOpen(true);
    setIsSubmitting(false);

    if (onSuccess) {
      onSuccess(reservationPayload);
    }
  };

  return (
    <section
      id="reserva"
      className="py-16 sm:py-20 lg:py-24 bg-cream-soft scroll-mt-20 relative overflow-hidden"
      aria-label="Reserva de mesas y contacto"
    >
      {/* Decorative ambient elements */}
      <div
        className="absolute -top-12 -left-12 w-80 h-80 bg-yellow-light/40 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-sage-light/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Visítanos"
          title="Reserva tu mesa"
          subtitle="Asegura tu lugar y cuéntanos si tienes alguna restricción alimentaria severa para preparar tu experiencia."
          align="center"
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Reservation Form (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-white rounded-card shadow-warm p-6 sm:p-8 md:p-10 border border-[#F3EADA]">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#F3EADA]/70">
              <Sparkles className="w-5 h-5 text-mustard" aria-hidden="true" />
              <h3 className="font-heading font-semibold text-xl text-ink">
                Datos de la reserva
              </h3>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-ink mb-1.5"
                >
                  Nombre completo <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-subtle">
                    <User className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                    placeholder="Ej. Valentina Gómez"
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    className={cn(
                      "w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-input border bg-[#FAF7F2]/40 text-ink placeholder:text-ink-subtle focus:bg-white focus:outline-none focus:ring-2 transition-all min-h-[44px]",
                      errors.fullName
                        ? "border-terracotta focus:ring-terracotta/30"
                        : "border-[#E8DEC8] focus:border-mustard focus:ring-mustard/30"
                    )}
                  />
                </div>
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.p
                      id="fullName-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-xs text-terracotta flex items-center gap-1 font-medium"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {errors.fullName.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email & Phone (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-ink mb-1.5"
                  >
                    Correo electrónico <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-subtle">
                      <Mail className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="tucorreo@ejemplo.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={cn(
                        "w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-input border bg-[#FAF7F2]/40 text-ink placeholder:text-ink-subtle focus:bg-white focus:outline-none focus:ring-2 transition-all min-h-[44px]",
                        errors.email
                          ? "border-terracotta focus:ring-terracotta/30"
                          : "border-[#E8DEC8] focus:border-mustard focus:ring-mustard/30"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        id="email-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-terracotta flex items-center gap-1 font-medium"
                        role="alert"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-ink mb-1.5"
                  >
                    Teléfono celular <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-subtle">
                      <Phone className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+51 987 654 321"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={cn(
                        "w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-input border bg-[#FAF7F2]/40 text-ink placeholder:text-ink-subtle focus:bg-white focus:outline-none focus:ring-2 transition-all min-h-[44px]",
                        errors.phone
                          ? "border-terracotta focus:ring-terracotta/30"
                          : "border-[#E8DEC8] focus:border-mustard focus:ring-mustard/30"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        id="phone-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-terracotta flex items-center gap-1 font-medium"
                        role="alert"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Date, Time & Guests (3 cols on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Date */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-ink mb-1.5"
                  >
                    Fecha <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-subtle">
                      <Calendar className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="date"
                      type="date"
                      min={todayStr}
                      {...register("date")}
                      aria-invalid={errors.date ? "true" : "false"}
                      aria-describedby={errors.date ? "date-error" : undefined}
                      className={cn(
                        "w-full pl-11 pr-3 py-3 text-sm rounded-input border bg-[#FAF7F2]/40 text-ink focus:bg-white focus:outline-none focus:ring-2 transition-all min-h-[44px]",
                        errors.date
                          ? "border-terracotta focus:ring-terracotta/30"
                          : "border-[#E8DEC8] focus:border-mustard focus:ring-mustard/30"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.date && (
                      <motion.p
                        id="date-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-terracotta flex items-center gap-1 font-medium"
                        role="alert"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {errors.date.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Time */}
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-semibold text-ink mb-1.5"
                  >
                    Hora <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-subtle">
                      <Clock className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <select
                      id="time"
                      {...register("time")}
                      aria-invalid={errors.time ? "true" : "false"}
                      aria-describedby={errors.time ? "time-error" : undefined}
                      className={cn(
                        "w-full pl-11 pr-8 py-3 text-sm rounded-input border bg-[#FAF7F2]/40 text-ink focus:bg-white focus:outline-none focus:ring-2 transition-all min-h-[44px] appearance-none",
                        errors.time
                          ? "border-terracotta focus:ring-terracotta/30"
                          : "border-[#E8DEC8] focus:border-mustard focus:ring-mustard/30"
                      )}
                    >
                      <option value="">Selecciona hora</option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  <AnimatePresence>
                    {errors.time && (
                      <motion.p
                        id="time-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-terracotta flex items-center gap-1 font-medium"
                        role="alert"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {errors.time.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Guests */}
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-sm font-semibold text-ink mb-1.5"
                  >
                    Personas (1-20) <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-subtle">
                      <Users className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="guests"
                      type="number"
                      min={1}
                      max={20}
                      {...register("guests", { valueAsNumber: true })}
                      aria-invalid={errors.guests ? "true" : "false"}
                      aria-describedby={errors.guests ? "guests-error" : undefined}
                      className={cn(
                        "w-full pl-11 pr-3 py-3 text-sm rounded-input border bg-[#FAF7F2]/40 text-ink focus:bg-white focus:outline-none focus:ring-2 transition-all min-h-[44px]",
                        errors.guests
                          ? "border-terracotta focus:ring-terracotta/30"
                          : "border-[#E8DEC8] focus:border-mustard focus:ring-mustard/30"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.guests && (
                      <motion.p
                        id="guests-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-terracotta flex items-center gap-1 font-medium"
                        role="alert"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {errors.guests.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dietary Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="dietaryNotes"
                    className="block text-sm font-semibold text-ink"
                  >
                    Restricciones alimentarias / Notas especiales{" "}
                    <span className="text-xs font-normal text-ink-subtle">
                      (opcional)
                    </span>
                  </label>
                  <span className="text-xs text-ink-subtle">
                    {dietaryNotesValue.length}/500
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-ink-subtle">
                    <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <textarea
                    id="dietaryNotes"
                    rows={3}
                    maxLength={500}
                    {...register("dietaryNotes")}
                    placeholder="Ej. Somos 2 personas celiacas y 1 con alergia severa a frutos secos. Requerimos vajilla dedicada."
                    aria-invalid={errors.dietaryNotes ? "true" : "false"}
                    aria-describedby={
                      errors.dietaryNotes ? "dietaryNotes-error" : undefined
                    }
                    className={cn(
                      "w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-input border bg-[#FAF7F2]/40 text-ink placeholder:text-ink-subtle focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none",
                      errors.dietaryNotes
                        ? "border-terracotta focus:ring-terracotta/30"
                        : "border-[#E8DEC8] focus:border-mustard focus:ring-mustard/30"
                    )}
                  />
                </div>
                <AnimatePresence>
                  {errors.dietaryNotes && (
                    <motion.p
                      id="dietaryNotes-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-xs text-terracotta flex items-center gap-1 font-medium"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {errors.dietaryNotes.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-4 px-6 rounded-button text-white font-semibold text-base shadow-warm flex items-center justify-center gap-2.5 transition-all duration-200 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard focus-visible:ring-offset-2",
                    isSubmitting
                      ? "bg-mustard/70 cursor-not-allowed"
                      : "bg-mustard hover:bg-mustard-hover hover:shadow-warm-hover active:scale-[0.99]"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      <span>Confirmando reserva...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                      <span>Confirmar mi reserva</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Side Info & Hours Card (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-card shadow-warm p-6 sm:p-8 border border-[#F3EADA]">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#F3EADA]/70">
                <ShieldCheck className="w-6 h-6 text-sage" aria-hidden="true" />
                <h4 className="font-heading font-semibold text-lg text-ink">
                  Espacio seguro & libre de trazas
                </h4>
              </div>

              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                En Limitless Sweet nos tomamos muy en serio cada reserva. Al
                especificar tus alergias, preparamos tu mesa, cubertería y menú
                con protocolos dedicados para brindarte tranquilidad absoluta.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-mustard shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-ink block">
                      Horarios de atención:
                    </span>
                    <ul className="text-ink-muted text-xs sm:text-sm space-y-0.5 mt-1">
                      <li>Lunes a Viernes: 8:00 - 20:00</li>
                      <li>Sábados: 9:00 - 21:00</li>
                      <li>Domingos: 10:00 - 18:00</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-[#F3EADA]/60">
                  <MapPin className="w-5 h-5 text-mustard shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-ink block">
                      Ubicación:
                    </span>
                    <span className="text-ink-muted text-xs sm:text-sm">
                      Av. José Larco 743, Miraflores, Lima
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-[#F3EADA]/60">
                  <Phone className="w-5 h-5 text-mustard shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-ink block">
                      Contacto telefónico:
                    </span>
                    <a
                      href="tel:+51987654321"
                      className="text-ink-muted text-xs sm:text-sm hover:text-mustard transition-colors"
                    >
                      +51 987 654 321
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Large Groups Callout */}
              <div className="mt-6 pt-5 border-t border-[#F3EADA]/80 bg-cream-soft -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 rounded-b-card">
                <div className="flex items-center gap-2 mb-1.5">
                  <HelpCircle className="w-4 h-4 text-mustard shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-coffee">
                    Grupos mayores a 20 personas
                  </span>
                </div>
                <p className="text-xs text-ink-muted mb-3">
                  ¿Tienes una celebración o evento privado? Contáctanos para coordinar menús temáticos personalizados.
                </p>
                <a
                  href="https://wa.me/51987654321?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20un%20evento%20grupal%20en%20Limitless%20Sweet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-button bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-98 min-h-[44px]"
                >
                  Escríbenos por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && confirmedData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-lg bg-white rounded-card shadow-warm-lg border border-[#F3EADA] p-6 sm:p-8 z-10 my-8 overflow-hidden"
            >
              {/* Close X Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full text-ink-subtle hover:text-ink hover:bg-cream-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Cerrar confirmación"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Celebratory Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-light text-sage mb-3 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
                </div>
                <h3
                  id="modal-title"
                  className="font-heading font-bold text-2xl sm:text-3xl text-ink leading-tight"
                >
                  ¡Reserva confirmada!
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-1.5">
                  Hemos apartado tu mesa. Te esperamos para vivir una experiencia sin restricciones.
                </p>
              </div>

              {/* Reservation Summary Details */}
              <div className="bg-[#FAF7F2] rounded-xl p-4 sm:p-5 border border-[#E8DEC8]/80 text-sm space-y-3 mb-5">
                <div className="flex justify-between items-center py-1 border-b border-[#E8DEC8]/50">
                  <span className="text-ink-subtle">Titular:</span>
                  <span className="font-semibold text-ink">
                    {confirmedData.fullName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[#E8DEC8]/50">
                  <span className="text-ink-subtle">Fecha y hora:</span>
                  <span className="font-semibold text-ink">
                    {confirmedData.date} a las {confirmedData.time}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[#E8DEC8]/50">
                  <span className="text-ink-subtle">Comensales:</span>
                  <span className="font-semibold text-ink">
                    {confirmedData.guests}{" "}
                    {confirmedData.guests === 1 ? "persona" : "personas"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[#E8DEC8]/50">
                  <span className="text-ink-subtle">Contacto:</span>
                  <span className="font-medium text-ink text-xs sm:text-sm">
                    {confirmedData.phone}
                  </span>
                </div>

                <div className="py-1">
                  <span className="text-ink-subtle block mb-1">
                    Restricciones señaladas:
                  </span>
                  <p className="text-xs sm:text-sm text-coffee bg-white p-2.5 rounded-lg border border-[#E8DEC8] italic">
                    {confirmedData.dietaryNotes &&
                    confirmedData.dietaryNotes.trim().length > 0
                      ? confirmedData.dietaryNotes
                      : "Sin restricciones especiales señaladas."}
                  </p>
                </div>
              </div>

              {/* Food Safety Protocol Reminder */}
              <div className="p-3.5 rounded-xl bg-yellow-light/40 border border-yellow/30 flex items-start gap-2.5 mb-6 text-xs text-coffee">
                <ShieldCheck className="w-4 h-4 text-mustard shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <strong>Protocolo de seguridad:</strong> Nuestro equipo sanitizará tu mesa según tus indicaciones. Si tienes una alergia severa de alto riesgo, recuerda reconfirmar los detalles con el anfitrión a tu llegada.
                </p>
              </div>

              {/* Modal Primary Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full py-3.5 px-6 rounded-button bg-mustard hover:bg-mustard-hover text-white font-semibold text-sm sm:text-base transition-all shadow-warm hover:shadow-warm-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard min-h-[48px]"
              >
                Entendido, ¡muchas gracias!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactReservation;
