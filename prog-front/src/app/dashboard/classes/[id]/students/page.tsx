"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  useClass,
  useClassStudents,
  useAddStudent,
  useRemoveStudent,
} from "@/lib/hooks/useClasses";
import StudentSelector from "@/components/classes/StudentSelector";

export default function ClassStudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const classId = parseInt(id);
  const { data: classData } = useClass(classId);
  const { data: students, isLoading } = useClassStudents(classId);
  const addStudent = useAddStudent(classId);
  const removeStudent = useRemoveStudent(classId);
  const [showSelector, setShowSelector] = useState(false);
  const [removingId, setRemovingId] = useState<number | undefined>();

  const handleAddStudent = async (studentId: number) => {
    try {
      await addStudent.mutateAsync(studentId);
      setShowSelector(false);
    } catch (error: any) {
      console.error("Error al añadir estudiante:", error);
      alert(
        error.response?.data?.error ||
          "Error al añadir estudiante. Intenta nuevamente."
      );
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm("¿Estás seguro de que deseas remover este estudiante?")) {
      return;
    }

    try {
      setRemovingId(studentId);
      await removeStudent.mutateAsync(studentId);
    } catch (error: any) {
      console.error("Error al remover estudiante:", error);
      alert("Error al remover estudiante");
    } finally {
      setRemovingId(undefined);
    }
  };

  const enrolledStudentIds = students?.map((s) => s.id) || [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href={`/dashboard/classes/${classId}`}
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a Detalle
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestionar Estudiantes
            </h1>
            {classData && (
              <p className="mt-2 text-gray-600">{classData.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botón para añadir estudiante */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        {!showSelector ? (
          <button
            onClick={() => setShowSelector(true)}
            className="w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-8 text-gray-600 hover:border-primary-500 hover:text-primary-600"
          >
            + Añadir Estudiante
          </button>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Seleccionar Estudiante
              </h2>
              <button
                onClick={() => setShowSelector(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cancelar
              </button>
            </div>
            <StudentSelector
              onSelect={handleAddStudent}
              isAdding={addStudent.isPending}
              excludeIds={enrolledStudentIds}
            />
          </div>
        )}
      </div>

      {/* Lista de estudiantes inscritos */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Estudiantes Inscritos ({students?.length || 0})
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-500">Cargando estudiantes...</p>
        ) : students && students.length > 0 ? (
          <div className="space-y-2">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded border border-gray-200 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <button
                  onClick={() => handleRemoveStudent(student.id)}
                  disabled={removingId === student.id}
                  className="rounded-md border border-error px-4 py-2 text-sm text-error hover:bg-error/10 disabled:opacity-50"
                >
                  {removingId === student.id ? "Removiendo..." : "Remover"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay estudiantes inscritos en esta clase.
          </p>
        )}
      </div>
    </div>
  );
}
