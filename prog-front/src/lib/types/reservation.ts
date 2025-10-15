import { Room } from "./room";
import { User } from "./user";
import { Class } from "./class";

// Tipos de reservas
export interface Reservation {
  id: number;
  room_id: number;
  room?: Room;
  user_id: number;
  user?: User;
  class_id?: number;
  class?: Class;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  purpose: string;
  estimated_attendees: number;
  status: "ACTIVE" | "CANCELLED";
  created_at: string;
  updated_at: string;
}

export interface CreateReservationData {
  room_id: number;
  class_id?: number;
  start_time: string;
  end_time: string;
  purpose: string;
  estimated_attendees: number;
}

export interface ReservationFilters {
  room_id?: number;
  building_id?: number;
  class_id?: number;
  user_id?: number;
  status?: "ACTIVE" | "CANCELLED";
  start_date?: string;
  end_date?: string;
}
