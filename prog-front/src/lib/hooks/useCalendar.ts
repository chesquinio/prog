import { useQuery } from "@tanstack/react-query";
import { reservationsApi } from "@/lib/api/endpoints/reservations";
import { roomsApi } from "@/lib/api/endpoints/rooms";

// Hook para obtener reservas por fecha
export function useReservationsByDate(date: string) {
  return useQuery({
    queryKey: ["reservations", "by-date", date],
    queryFn: async () => {
      const response = await reservationsApi.getAll({
        start_date: date,
        end_date: date,
      });
      return response.data;
    },
    enabled: !!date,
  });
}

// Hook para obtener disponibilidad de aulas en un rango de fechas
export function useRoomAvailability(
  roomId?: number,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["room-availability", roomId, startDate, endDate],
    queryFn: async () => {
      if (!roomId || !startDate || !endDate) return [];

      const response = await reservationsApi.getAll({
        room_id: roomId,
        start_date: startDate,
        end_date: endDate,
      });
      return response.data;
    },
    enabled: !!roomId && !!startDate && !!endDate,
  });
}

// Hook para obtener todas las aulas con sus reservas del día
export function useDailySchedule(date: string, buildingId?: number) {
  const { data: rooms } = useQuery({
    queryKey: ["rooms", buildingId],
    queryFn: async () => {
      const response = await roomsApi.getAll(
        buildingId ? { building_id: buildingId } : undefined
      );
      return response.data;
    },
  });

  const { data: reservations } = useReservationsByDate(date);

  return {
    rooms: rooms || [],
    reservations: reservations || [],
    isLoading: !rooms || !reservations,
  };
}
