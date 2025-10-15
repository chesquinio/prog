import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/endpoints/users";

// Hook para obtener todos los usuarios con filtros
export function useUsers(params?: { role?: string; is_confirmed?: boolean }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await usersApi.getAll(params);
      return response.data;
    },
  });
}

// Hook para obtener un usuario por ID
export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await usersApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook para confirmar un usuario (solo ADMIN)
export function useConfirmUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await usersApi.confirm(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Hook para actualizar un usuario
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await usersApi.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Hook para eliminar un usuario
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await usersApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
