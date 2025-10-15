// Tipos de usuario
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "PROFESSOR" | "STUDENT";
  is_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = User["role"];
