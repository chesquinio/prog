import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsApi } from "@/lib/api/endpoints/rooms";
import { Room } from "@/lib/types/room";

// Hook para obtener todas las aulas (con filtro opcional por edificio)
export function useRooms(buildingId?: number) {
  return useQuery({
    queryKey: buildingId ? ["rooms", { building_id: buildingId }] : ["rooms"],
    queryFn: async () => {
      const response = await roomsApi.getAll(
        buildingId ? { building_id: buildingId } : undefined
      );
      return response.data;
    },
  });
}

// Hook para obtener un aula por ID
export function useRoom(id: number) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: async () => {
      const response = await roomsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook para crear un aula
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Room>) => {
      const response = await roomsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// Hook para actualizar un aula
export function useUpdateRoom(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Room>) => {
      const response = await roomsApi.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", id] });
    },
  });
}

// Hook para eliminar un aula
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await roomsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// Hook para verificar disponibilidad de un aula
export function useRoomAvailability(roomId: number, date: string) {
  return useQuery({
    queryKey: ["rooms", roomId, "availability", date],
    queryFn: async () => {
      const response = await roomsApi.checkAvailability(roomId, date);
      return response.data;
    },
    enabled: !!roomId && !!date,
  });
}
