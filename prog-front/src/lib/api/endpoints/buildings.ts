import apiClient from "../client";
import { Building } from "@/lib/types/building";

export const buildingsApi = {
  getAll: () => apiClient.get<Building[]>("/buildings"),

  getById: (id: number) => apiClient.get<Building>(`/buildings/${id}`),

  create: (data: Partial<Building>) =>
    apiClient.post<Building>("/buildings", data),

  update: (id: number, data: Partial<Building>) =>
    apiClient.patch<Building>(`/buildings/${id}`, data),

  delete: (id: number) => apiClient.delete(`/buildings/${id}`),
};
