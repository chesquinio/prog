import apiClient from "../client";
import {
  Reservation,
  CreateReservationData,
  ReservationFilters,
} from "@/lib/types/reservation";

export const reservationsApi = {
  getAll: (filters?: ReservationFilters) =>
    apiClient.get<Reservation[]>("/reservations", { params: filters }),

  getById: (id: number) => apiClient.get<Reservation>(`/reservations/${id}`),

  getMy: () => apiClient.get<Reservation[]>("/reservations/my"),

  create: (data: CreateReservationData) =>
    apiClient.post<Reservation>("/reservations", data),

  update: (id: number, data: CreateReservationData) =>
    apiClient.put<Reservation>(`/reservations/${id}`, data),

  cancel: (id: number) =>
    apiClient.patch<Reservation>(`/reservations/${id}/cancel`),

  delete: (id: number) => apiClient.delete(`/reservations/${id}`),

  checkAvailability: (params: {
    room_id: number;
    start_time: string;
    end_time: string;
    exclude_reservation_id?: number;
  }) =>
    apiClient.post<{ available: boolean; conflicts?: Reservation[] }>(
      "/reservations/check-availability",
      params
    ),
};
