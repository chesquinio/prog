"use client";

import { format, addDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Reservation } from "@/lib/types/reservation";
import { Room } from "@/lib/types/room";

interface DayScheduleProps {
  date: Date;
  rooms: Room[];
  reservations: Reservation[];
}

export default function DaySchedule({
  date,
  rooms,
  reservations,
}: DayScheduleProps) {
  // Horario de 8:00 a 20:00
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const getReservationsForRoomAndHour = (roomId: number, hour: number) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_time);
      const endDate = new Date(res.end_time);
      const startHour = startDate.getHours();
      const endHour = endDate.getHours();

      return (
        res.room_id === roomId &&
        isSameDay(startDate, date) &&
        hour >= startHour &&
        hour < endHour
      );
    });
  };

  if (rooms.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <p className="text-gray-600">No hay aulas disponibles para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Hora
            </th>
            {rooms.map((room) => (
              <th
                key={room.id}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <div className="font-semibold text-gray-900">{room.name}</div>
                <div className="text-xs font-normal text-gray-500">
                  Cap: {room.capacity}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-900">
                {hour}:00 - {hour + 1}:00
              </td>
              {rooms.map((room) => {
                const roomReservations = getReservationsForRoomAndHour(
                  room.id,
                  hour
                );
                const hasReservation = roomReservations.length > 0;

                return (
                  <td
                    key={`${room.id}-${hour}`}
                    className={`px-4 py-3 text-sm ${
                      hasReservation ? "bg-red-50" : "bg-green-50"
                    }`}
                  >
                    {hasReservation ? (
                      <div className="space-y-1">
                        {roomReservations.map((res) => (
                          <div
                            key={res.id}
                            className="rounded bg-red-100 px-2 py-1 text-xs"
                          >
                            <div className="font-semibold text-red-900">
                              Reservado
                            </div>
                            {res.user && (
                              <div className="text-red-700">
                                {res.user.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-green-700">Disponible</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
