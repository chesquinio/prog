"use client";

import Link from "next/link";
import { Class } from "@/lib/types/class";
import { formatDate } from "@/lib/utils/date";

interface ClassCardProps {
  classData: Class;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export default function ClassCard({
  classData,
  onDelete,
  isDeleting = false,
}: ClassCardProps) {
  const studentCount = classData.students?.length || 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {classData.name}
        </h3>
        {classData.subject && (
          <p className="mt-1 text-sm text-primary-600">{classData.subject}</p>
        )}
      </div>

      {classData.description && (
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {classData.description}
        </p>
      )}

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <span>👥</span>
          <span>
            {studentCount} {studentCount === 1 ? "estudiante" : "estudiantes"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>📅</span>
          <span>{formatDate(classData.created_at)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/classes/${classData.id}`}
          className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-center text-sm text-white hover:bg-primary-700"
        >
          Ver Detalles
        </Link>
        <Link
          href={`/dashboard/classes/${classData.id}/students`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          👥 Estudiantes
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(classData.id)}
            disabled={isDeleting}
            className="rounded-md border border-error px-4 py-2 text-sm text-error hover:bg-error/10 disabled:opacity-50"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
