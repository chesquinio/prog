"use client";

import { Class } from "@/lib/types/class";
import ClassCard from "./ClassCard";

interface ClassListProps {
  classes: Class[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  deletingId?: number;
}

export default function ClassList({
  classes,
  isLoading = false,
  onDelete,
  deletingId,
}: ClassListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <span className="text-3xl">📚</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No hay clases aún
        </h3>
        <p className="mb-6 text-gray-600">
          Comienza creando tu primera clase para gestionar tus estudiantes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classData) => (
        <ClassCard
          key={classData.id}
          classData={classData}
          onDelete={onDelete}
          isDeleting={deletingId === classData.id}
        />
      ))}
    </div>
  );
}
