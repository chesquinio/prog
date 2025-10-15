"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClasses, useDeleteClass } from "@/lib/hooks/useClasses";
import ClassList from "@/components/classes/ClassList";

export default function ClassesPage() {
  const router = useRouter();
  const { data: classes, isLoading } = useClasses();
  const deleteClass = useDeleteClass();
  const [deletingId, setDeletingId] = useState<number | undefined>();

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteClass.mutateAsync(id);
    } catch (error) {
      console.error("Error al eliminar clase:", error);
      alert("Error al eliminar la clase");
    } finally {
      setDeletingId(undefined);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Clases</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tus clases y estudiantes
          </p>
        </div>
        <Link
          href="/dashboard/classes/new"
          className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          + Nueva Clase
        </Link>
      </div>

      <ClassList
        classes={classes || []}
        isLoading={isLoading}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}
