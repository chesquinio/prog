"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import ClassForm from "@/components/classes/ClassForm";
import { useCreateClass } from "@/lib/hooks/useClasses";
import { ClassFormData } from "@/lib/validations/class";

export default function NewClassPage() {
  const router = useRouter();
  const createClass = useCreateClass();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ClassFormData) => {
    try {
      setError(null);
      await createClass.mutateAsync(data);
      router.push("/dashboard/classes");
    } catch (err: any) {
      console.error("Error al crear clase:", err);
      setError(
        err.response?.data?.error ||
          "Error al crear la clase. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/classes"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a Mis Clases
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Clase</h1>
        <p className="mt-2 text-gray-600">
          Crea una nueva clase para gestionar tus estudiantes
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        {error && (
          <div className="mb-4 rounded-md bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        <ClassForm
          onSubmit={handleSubmit}
          isLoading={createClass.isPending}
          submitLabel="Crear Clase"
        />
      </div>
    </div>
  );
}
