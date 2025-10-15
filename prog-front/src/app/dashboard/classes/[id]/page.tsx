"use client";

import { use } from "react";
import Link from "next/link";
import { useClass } from "@/lib/hooks/useClasses";
import { formatDate } from "@/lib/utils/date";

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const classId = parseInt(id);
  const { data: classData, isLoading } = useClass(classId);

  if (isLoading) {
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

  const studentCount = classData.students?.length || 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href="/dashboard/classes"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a Mis Clases
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {classData.name}
            </h1>
            {classData.subject && (
              <p className="mt-2 text-lg text-primary-600">
                {classData.subject}
              </p>
            )}
          </div>
          <Link
            href={`/dashboard/classes/${classId}/edit`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            ✏️ Editar
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Información de la clase */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Información
          </h2>
          <div className="space-y-3">
            {classData.description && (
              <div>
                <p className="text-sm font-medium text-gray-700">Descripción</p>
                <p className="mt-1 text-gray-600">{classData.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">Creada</p>
              <p className="mt-1 text-gray-600">
                {formatDate(classData.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Profesor</p>
              <p className="mt-1 text-gray-600">
                {classData.professor?.name || "No disponible"}
              </p>
            </div>
          </div>
        </div>

        {/* Estudiantes */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Estudiantes ({studentCount})
            </h2>
            <Link
              href={`/dashboard/classes/${classId}/students`}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
            >
              Gestionar Estudiantes
            </Link>
          </div>

          {studentCount === 0 ? (
            <p className="text-center text-gray-500">
              No hay estudiantes inscritos aún.
            </p>
          ) : (
            <div className="space-y-2">
              {classData.students?.slice(0, 5).map((student) => (
                <div
                  key={student.student?.id || student.student_id}
                  className="flex items-center justify-between rounded border border-gray-200 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.student?.name || "Estudiante"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {student.student?.email || ""}
                    </p>
                  </div>
                </div>
              ))}
              {studentCount > 5 && (
                <p className="text-center text-sm text-gray-500">
                  Y {studentCount - 5} estudiantes más...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
