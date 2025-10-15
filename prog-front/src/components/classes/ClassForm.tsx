"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema, type ClassFormData } from "@/lib/validations/class";
import { Class } from "@/lib/types/class";

interface ClassFormProps {
  initialData?: Class;
  onSubmit: (data: ClassFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function ClassForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Guardar",
}: ClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || "",
          subject: initialData.subject || "",
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
          Nombre de la Clase *
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Ej: Matemáticas Aplicadas"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700"
        >
          Materia *
        </label>
        <input
          {...register("subject")}
          type="text"
          id="subject"
          placeholder="Ej: Matemáticas"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-error">{errors.subject.message}</p>
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
          rows={4}
          placeholder="Descripción de la clase..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error">
            {errors.description.message}
          </p>
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
