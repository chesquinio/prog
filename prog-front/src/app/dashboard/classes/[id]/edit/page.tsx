"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClassForm from "@/components/classes/ClassForm";
import { useClass, useUpdateClass } from "@/lib/hooks/useClasses";
import { ClassFormData } from "@/lib/validations/class";

export default function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const classId = parseInt(id);
  const router = useRouter();
  const { data: classData, isLoading: isLoadingClass } = useClass(classId);
  const updateClass = useUpdateClass(classId);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ClassFormData) => {
    try {
      setError(null);
      await updateClass.mutateAsync(data);
      router.push(`/dashboard/classes/${classId}`);
    } catch (err: any) {
      console.error("Error al actualizar clase:", err);
      setError(
        err.response?.data?.error ||
          "Error al actualizar la clase. Intenta nuevamente."
      );
    }
  };

  if (isLoadingClass) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Clase no encontrada
        </h2>
        <Link
          href="/dashboard/classes"
          className="mt-4 inline-block text-primary-600 hover:text-primary-700"
        >
          Volver a Mis Clases
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/dashboard/classes/${classId}`}
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a Detalle
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Clase</h1>
        <p className="mt-2 text-gray-600">
          Actualiza la información de la clase
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        {error && (
          <div className="mb-4 rounded-md bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        <ClassForm
          initialData={classData}
          onSubmit={handleSubmit}
          isLoading={updateClass.isPending}
          submitLabel="Actualizar Clase"
        />
      </div>
    </div>
  );
}
