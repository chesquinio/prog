"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, type RoomFormData } from "@/lib/validations/room";
import { Room } from "@/lib/types/room";
import { useBuildings } from "@/lib/hooks/useBuildings";

interface RoomFormProps {
  initialData?: Room;
  onSubmit: (data: RoomFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  preselectedBuildingId?: number;
}

export default function RoomForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Guardar",
  preselectedBuildingId,
}: RoomFormProps) {
  const { data: buildings, isLoading: isLoadingBuildings } = useBuildings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          building_id: initialData.building_id,
          capacity: initialData.capacity,
          description: initialData.description || "",
          resources:
            typeof initialData.resources === "string"
              ? initialData.resources
              : JSON.stringify(initialData.resources || ""),
        }
      : preselectedBuildingId
      ? { building_id: preselectedBuildingId }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="building_id"
          className="block text-sm font-medium text-gray-700"
        >
          Edificio *
        </label>
        <select
          {...register("building_id", { valueAsNumber: true })}
          id="building_id"
          disabled={!!preselectedBuildingId || isLoadingBuildings}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100"
        >
          <option value="">Selecciona un edificio</option>
          {buildings?.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
        {errors.building_id && (
          <p className="mt-1 text-sm text-error">
            {errors.building_id.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre del Aula *
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Ej: Aula 101, Laboratorio A"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="capacity"
          className="block text-sm font-medium text-gray-700"
        >
          Capacidad *
        </label>
        <input
          {...register("capacity", { valueAsNumber: true })}
          type="number"
          id="capacity"
          min="1"
          placeholder="Ej: 30"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.capacity && (
          <p className="mt-1 text-sm text-error">{errors.capacity.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          placeholder="Descripción del aula..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="resources"
          className="block text-sm font-medium text-gray-700"
        >
          Recursos (JSON)
        </label>
        <textarea
          {...register("resources")}
          id="resources"
          rows={4}
          placeholder='{"proyector": true, "pizarra": "digital", "enchufes": 20}'
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Formato JSON. Ej: {`{"proyector": true, "wifi": true}`}
        </p>
        {errors.resources && (
          <p className="mt-1 text-sm text-error">{errors.resources.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
