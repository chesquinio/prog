import { Building } from "./building";

// Tipos de aulas/salas
export interface Room {
  id: number;
  building_id: number;
  building?: Building;
  name: string;
  capacity: number;
  resources?: string | object; // JSONB
  description?: string;
  created_at: string;
  updated_at: string;
}
