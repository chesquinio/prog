import { z } from "zod";

export const buildingSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  address: z.string().optional(),
  campus: z.string().optional(),
});

export type BuildingFormData = z.infer<typeof buildingSchema>;
