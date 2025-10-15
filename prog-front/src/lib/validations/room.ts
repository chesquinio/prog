import { z } from "zod";

export const roomSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  building_id: z.number().positive("Selecciona un edificio"),
  capacity: z.number().positive("La capacidad debe ser mayor a 0"),
  description: z.string().optional(),
  resources: z.string().optional(),
});

export type RoomFormData = z.infer<typeof roomSchema>;
