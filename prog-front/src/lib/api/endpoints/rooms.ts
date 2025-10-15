import apiClient from "../client";
import { Room } from "@/lib/types/room";

export const roomsApi = {
  getAll: (params?: { building_id?: number }) =>
    apiClient.get<Room[]>("/rooms", { params }),

  getById: (id: number) => apiClient.get<Room>(`/rooms/${id}`),

  create: (data: Partial<Room>) => apiClient.post<Room>("/rooms", data),

  update: (id: number, data: Partial<Room>) =>
    apiClient.patch<Room>(`/rooms/${id}`, data),

  delete: (id: number) => apiClient.delete(`/rooms/${id}`),

  checkAvailability: (roomId: number, date: string) =>
    apiClient.get(`/rooms/${roomId}/availability`, { params: { date } }),
};
