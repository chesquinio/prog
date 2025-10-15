import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesApi } from "@/lib/api/endpoints/classes";
import { CreateClassData, UpdateClassData } from "@/lib/types/class";

// Hook para obtener todas las clases
export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await classesApi.getAll();
      return response.data;
    },
  });
}

// Hook para obtener una clase por ID
export function useClass(id: number) {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: async () => {
      const response = await classesApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook para crear una clase
export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClassData) => {
      const response = await classesApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

// Hook para actualizar una clase
export function useUpdateClass(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateClassData) => {
      const response = await classesApi.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes", id] });
    },
  });
}

// Hook para eliminar una clase
export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await classesApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

// Hook para obtener estudiantes de una clase
export function useClassStudents(classId: number) {
  return useQuery({
    queryKey: ["classes", classId, "students"],
    queryFn: async () => {
      const response = await classesApi.getStudents(classId);
      return response.data;
    },
    enabled: !!classId,
  });
}

// Hook para añadir estudiante a una clase
export function useAddStudent(classId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: number) => {
      await classesApi.addStudent(classId, studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes", classId, "students"],
      });
      queryClient.invalidateQueries({ queryKey: ["classes", classId] });
    },
  });
}

// Hook para remover estudiante de una clase
export function useRemoveStudent(classId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: number) => {
      await classesApi.removeStudent(classId, studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes", classId, "students"],
      });
      queryClient.invalidateQueries({ queryKey: ["classes", classId] });
    },
  });
}
