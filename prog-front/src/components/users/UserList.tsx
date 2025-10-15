"use client";

import { User } from "@/lib/types/user";
import UserCard from "./UserCard";

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  onConfirm?: (id: number) => void;
  onReject?: (id: number) => void;
  onChangeRole?: (id: number, role: string) => void;
  onDelete?: (id: number) => void;
  processingId?: number;
}

export default function UserList({
  users,
  isLoading = false,
  onConfirm,
  onReject,
  onChangeRole,
  onDelete,
  processingId,
}: UserListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <span className="text-3xl">👥</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No hay usuarios
        </h3>
        <p className="text-gray-600">
          No se encontraron usuarios con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onConfirm={onConfirm}
          onReject={onReject}
          onChangeRole={onChangeRole}
          onDelete={onDelete}
          isProcessing={processingId === user.id}
        />
      ))}
    </div>
  );
}
