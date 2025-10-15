import { z } from "zod";

export const classSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  subject: z.string().min(2, "La materia es requerida"),
});

export type ClassFormData = z.infer<typeof classSchema>;
