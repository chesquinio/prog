import apiClient from "../client";
import { Class, CreateClassData, UpdateClassData } from "@/lib/types/class";
import { User } from "@/lib/types/user";

export const classesApi = {
  getAll: () => apiClient.get<Class[]>("/classes"),

  getById: (id: number) => apiClient.get<Class>(`/classes/${id}`),

  create: (data: CreateClassData) => apiClient.post<Class>("/classes", data),

  update: (id: number, data: UpdateClassData) =>
    apiClient.patch<Class>(`/classes/${id}`, data),

  delete: (id: number) => apiClient.delete(`/classes/${id}`),

  addStudent: (classId: number, studentId: number) =>
    apiClient.post(`/classes/${classId}/students`, { student_id: studentId }),

  removeStudent: (classId: number, studentId: number) =>
    apiClient.delete(`/classes/${classId}/students/${studentId}`),

  getStudents: (classId: number) =>
    apiClient.get<User[]>(`/classes/${classId}/students`),
};
