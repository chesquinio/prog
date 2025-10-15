"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buildingSchema,
  type BuildingFormData,
} from "@/lib/validations/building";
import { Building } from "@/lib/types/building";

interface BuildingFormProps {
  initialData?: Building;
  onSubmit: (data: BuildingFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function BuildingForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Guardar",
}: BuildingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          address: initialData.address || "",
          campus: initialData.campus || "",
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre del Edificio *
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Ej: Edificio A, Pabellón Principal"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Dirección
        </label>
        <input
          {...register("address")}
          type="text"
          id="address"
          placeholder="Ej: Av. Universidad 123"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-error">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="campus"
          className="block text-sm font-medium text-gray-700"
        >
          Campus
        </label>
        <input
          {...register("campus")}
          type="text"
          id="campus"
          placeholder="Ej: Campus Norte, Campus Sur"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.campus && (
          <p className="mt-1 text-sm text-error">{errors.campus.message}</p>
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
