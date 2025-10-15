import apiClient from "../client";
import { User } from "@/lib/types/user";

export const usersApi = {
  getAll: (params?: { role?: string; is_confirmed?: boolean }) =>
    apiClient.get<User[]>("/users", { params }),

  getById: (id: number) => apiClient.get<User>(`/users/${id}`),

  confirm: (id: number) =>
    apiClient.patch<User>(`/users/${id}`, { is_confirmed: true }),

  update: (id: number, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data),

  delete: (id: number) => apiClient.delete(`/users/${id}`),
};
