import { z } from "zod";

/**
 * Authoritative Reservation Schema derived from ORIGINAL_REQUEST.md,
 * plan-desarrollo-limitless-sweet.md, and PROJECT.md specifications.
 */
export const authoritativeReservationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Ingresa tu nombre completo (mínimo 2 caracteres)"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .min(7, "Ingresa un número telefónico válido (mínimo 7 dígitos)"),
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

export type AuthoritativeReservationValues = z.infer<typeof authoritativeReservationSchema>;
