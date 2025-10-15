"use client";

import { useState } from "react";
import { useUsers } from "@/lib/hooks/useUsers";
import { User } from "@/lib/types/user";

interface StudentSelectorProps {
  onSelect: (studentId: number) => void;
  isAdding?: boolean;
  excludeIds?: number[];
}

export default function StudentSelector({
  onSelect,
  isAdding = false,
  excludeIds = [],
}: StudentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: students, isLoading } = useUsers({
    role: "STUDENT",
    is_confirmed: true,
  });

  const filteredStudents = students?.filter(
    (student: User) =>
      !excludeIds.includes(student.id) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Buscar estudiante por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando estudiantes...</p>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          filteredStudents.map((student: User) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
              <button
                onClick={() => onSelect(student.id)}
                disabled={isAdding}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isAdding ? "Añadiendo..." : "Añadir"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            {searchTerm
              ? "No se encontraron estudiantes"
              : "No hay estudiantes disponibles"}
          </p>
        )}
      </div>
    </div>
  );
}
