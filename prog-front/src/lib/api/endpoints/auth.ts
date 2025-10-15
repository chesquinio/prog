import apiClient from "../client";
import { LoginCredentials, RegisterData, AuthResponse } from "@/lib/types/auth";
import { User } from "@/lib/types/user";

export const authApi = {
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>("/auth/login", credentials),

  logout: () => apiClient.post("/auth/logout"),

  me: () => apiClient.get<User>("/auth/me"),
};
