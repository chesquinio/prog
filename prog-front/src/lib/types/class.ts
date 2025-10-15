import { User } from "./user";

// Tipos de clases
export interface Class {
  id: number;
  name: string;
  description?: string;
  professor_id: number;
  professor?: User;
  subject?: string;
  students?: ClassStudent[];
  created_at: string;
  updated_at: string;
}

export interface ClassStudent {
  class_id: number;
  student_id: number;
  student?: User;
  enrolled_at: string;
}

export interface CreateClassData {
  name: string;
  description?: string;
  subject?: string;
}

export interface UpdateClassData {
  name?: string;
  description?: string;
  subject?: string;
}
