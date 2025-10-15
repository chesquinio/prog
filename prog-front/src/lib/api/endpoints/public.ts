import apiClient from "../client";
import { Reservation } from "@/lib/types/reservation";

export const publicApi = {
  getReservations: (params?: { building_id?: number; room_id?: number }) =>
    apiClient.get<Reservation[]>("/public/reservations", { params }),
};
