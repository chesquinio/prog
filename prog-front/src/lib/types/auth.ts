// Tipos de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "PROFESSOR" | "STUDENT";
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user?: any;
  message?: string;
}
