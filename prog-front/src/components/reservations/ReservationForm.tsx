"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  reservationSchema,
  ReservationFormData,
} from "@/lib/validations/reservation";
import { useBuildings } from "@/lib/hooks/useBuildings";
import { useRooms } from "@/lib/hooks/useRooms";
import { useCheckAvailability } from "@/lib/hooks/useReservations";
import { Reservation } from "@/lib/types/reservation";

interface ReservationFormProps {
  initialData?: Reservation;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ReservationForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ReservationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: initialData
      ? {
          room_id: initialData.room_id,
          start_time: initialData.start_time.slice(0, 16), // formato datetime-local
          end_time: initialData.end_time.slice(0, 16),
          purpose: initialData.purpose,
        }
      : undefined,
  });

  const [selectedBuilding, setSelectedBuilding] = useState<
    number | undefined
  >();
  const { data: buildings } = useBuildings();
  const { data: rooms } = useRooms(selectedBuilding);

  // Watch para verificar disponibilidad
  const roomId = watch("room_id");
  const startTime = watch("start_time");
  const endTime = watch("end_time");

  const { data: availability } = useCheckAvailability(
    roomId,
    startTime,
    endTime,
    initialData?.id
  );

  // Si hay datos iniciales, configurar el edificio
  useEffect(() => {
    if (initialData && rooms) {
      const room = rooms.find((r) => r.id === initialData.room_id);
      if (room) {
        setSelectedBuilding(room.building_id);
      }
    }
  }, [initialData, rooms]);

  const handleFormSubmit = async (data: ReservationFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Selector de Edificio */}
      <div>
        <label
          htmlFor="building"
          className="block text-sm font-medium text-gray-700"
        >
          Edificio
        </label>
        <select
          id="building"
          value={selectedBuilding || ""}
          onChange={(e) => {
            setSelectedBuilding(
              e.target.value ? Number(e.target.value) : undefined
            );
            setValue("room_id", 0); // Reset room selection
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Selecciona un edificio</option>
          {buildings?.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de Aula */}
      <div>
        <label
          htmlFor="room_id"
          className="block text-sm font-medium text-gray-700"
        >
          Aula *
        </label>
        <select
          id="room_id"
          {...register("room_id", { valueAsNumber: true })}
          disabled={!selectedBuilding}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-100"
        >
          <option value="">Selecciona un aula</option>
          {rooms?.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} (Capacidad: {room.capacity})
            </option>
          ))}
        </select>
        {errors.room_id && (
          <p className="mt-1 text-sm text-red-600">{errors.room_id.message}</p>
        )}
      </div>

      {/* Fecha y Hora de Inicio */}
      <div>
        <label
          htmlFor="start_time"
          className="block text-sm font-medium text-gray-700"
        >
          Fecha y Hora de Inicio *
        </label>
        <input
          type="datetime-local"
          id="start_time"
          {...register("start_time")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.start_time && (
          <p className="mt-1 text-sm text-red-600">
            {errors.start_time.message}
          </p>
        )}
      </div>

      {/* Fecha y Hora de Fin */}
      <div>
        <label
          htmlFor="end_time"
          className="block text-sm font-medium text-gray-700"
        >
          Fecha y Hora de Fin *
        </label>
        <input
          type="datetime-local"
          id="end_time"
          {...register("end_time")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.end_time && (
          <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
        )}
      </div>

      {/* Propósito */}
      <div>
        <label
          htmlFor="purpose"
          className="block text-sm font-medium text-gray-700"
        >
          Propósito *
        </label>
        <textarea
          id="purpose"
          {...register("purpose")}
          rows={4}
          placeholder="Describe el motivo de la reserva..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.purpose && (
          <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
        )}
      </div>

      {/* Indicador de Disponibilidad */}
      {roomId && startTime && endTime && availability && (
        <div
          className={`rounded-lg border-2 p-4 ${
            availability.available
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {availability.available ? "✅" : "❌"}
            </span>
            <div>
              <p
                className={`font-semibold ${
                  availability.available ? "text-green-800" : "text-red-800"
                }`}
              >
                {availability.available
                  ? "Aula disponible"
                  : "Aula no disponible"}
              </p>
              {!availability.available && availability.conflicts && (
                <p className="mt-1 text-sm text-red-700">
                  Hay {availability.conflicts.length} reserva(s) en conflicto en
                  este horario.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading || (availability && !availability.available)}
          className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading
            ? "Guardando..."
            : initialData
            ? "Actualizar"
            : "Crear Reserva"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
