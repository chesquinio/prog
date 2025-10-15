import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsApi } from "@/lib/api/endpoints/reservations";
import { ReservationFormData } from "@/lib/validations/reservation";

// Hook para obtener todas las reservas con filtros
export function useReservations(params?: {
  user_id?: number;
  room_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: async () => {
      const response = await reservationsApi.getAll(params);
      return response.data;
    },
  });
}

// Hook para obtener una reserva específica
export function useReservation(id: number) {
  return useQuery({
    queryKey: ["reservations", id],
    queryFn: async () => {
      const response = await reservationsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook para obtener las reservas del usuario actual
export function useMyReservations() {
  return useQuery({
    queryKey: ["reservations", "my-reservations"],
    queryFn: async () => {
      const response = await reservationsApi.getMy();
      return response.data;
    },
  });
}

// Hook para crear una reserva
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const response = await reservationsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar todas las queries de reservas
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// Hook para actualizar una reserva
export function useUpdateReservation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const response = await reservationsApi.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// Hook para cancelar una reserva
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await reservationsApi.cancel(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// Hook para eliminar una reserva (admin)
export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await reservationsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// Hook para verificar disponibilidad de un aula en un horario específico
export function useCheckAvailability(
  roomId: number,
  startTime: string,
  endTime: string,
  excludeReservationId?: number
) {
  return useQuery({
    queryKey: [
      "availability",
      roomId,
      startTime,
      endTime,
      excludeReservationId,
    ],
    queryFn: async () => {
      const response = await reservationsApi.checkAvailability({
        room_id: roomId,
        start_time: startTime,
        end_time: endTime,
        exclude_reservation_id: excludeReservationId,
      });
      return response.data;
    },
    enabled: !!roomId && !!startTime && !!endTime,
  });
}
