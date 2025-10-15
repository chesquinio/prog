import { z } from "zod";

export const reservationSchema = z
  .object({
    room_id: z.number().positive("Selecciona un aula"),
    class_id: z.number().positive().optional(),
    start_time: z.string().min(1, "Fecha de inicio requerida"),
    end_time: z.string().min(1, "Fecha de fin requerida"),
    purpose: z.string().min(5, "Describe el propósito de la reserva"),
    estimated_attendees: z.number().positive("Cantidad de asistentes inválida"),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      return end > start;
    },
    {
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["end_time"],
    }
  );

export type ReservationFormData = z.infer<typeof reservationSchema>;
