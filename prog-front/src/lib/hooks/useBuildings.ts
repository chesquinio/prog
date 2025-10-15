import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildingsApi } from "@/lib/api/endpoints/buildings";
import { Building } from "@/lib/types/building";

// Hook para obtener todos los edificios
export function useBuildings() {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const response = await buildingsApi.getAll();
      return response.data;
    },
  });
}

// Hook para obtener un edificio por ID
export function useBuilding(id: number) {
  return useQuery({
    queryKey: ["buildings", id],
    queryFn: async () => {
      const response = await buildingsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook para crear un edificio
export function useCreateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Building>) => {
      const response = await buildingsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}

// Hook para actualizar un edificio
export function useUpdateBuilding(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Building>) => {
      const response = await buildingsApi.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["buildings", id] });
    },
  });
}

// Hook para eliminar un edificio
export function useDeleteBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await buildingsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}
