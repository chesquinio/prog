"use client";

import { User } from "@/lib/types/user";
import { formatDate } from "@/lib/utils/date";

interface UserCardProps {
  user: User;
  onConfirm?: (id: number) => void;
  onReject?: (id: number) => void;
  onChangeRole?: (id: number, role: string) => void;
  onDelete?: (id: number) => void;
  isProcessing?: boolean;
}

export default function UserCard({
  user,
  onConfirm,
  onReject,
  onChangeRole,
  onDelete,
  isProcessing = false,
}: UserCardProps) {
  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: "bg-purple-100 text-purple-800",
      PROFESSOR: "bg-blue-100 text-blue-800",
      STUDENT: "bg-green-100 text-green-800",
    };
    return badges[role as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="mt-1 text-sm text-gray-600">{user.email}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadge(
            user.role
          )}`}
        >
          {user.role}
        </span>
      </div>

      <div className="mb-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>Registrado: {formatDate(user.created_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{user.is_confirmed ? "✅" : "⏳"}</span>
          <span>
            {user.is_confirmed ? "Confirmado" : "Pendiente de confirmación"}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-2">
        {!user.is_confirmed && onConfirm && onReject && (
          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(user.id)}
              disabled={isProcessing}
              className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              Confirmar
            </button>
            <button
              onClick={() => onReject(user.id)}
              disabled={isProcessing}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              Rechazar
            </button>
          </div>
        )}

        {user.is_confirmed && onChangeRole && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Cambiar Rol
            </label>
            <select
              value={user.role}
              onChange={(e) => onChangeRole(user.id, e.target.value)}
              disabled={isProcessing}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-100"
            >
              <option value="STUDENT">Estudiante</option>
              <option value="PROFESSOR">Profesor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
        )}

        {onDelete && user.role !== "ADMIN" && (
          <button
            onClick={() => onDelete(user.id)}
            disabled={isProcessing}
            className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Eliminar Usuario
          </button>
        )}
      </div>
    </div>
  );
}
