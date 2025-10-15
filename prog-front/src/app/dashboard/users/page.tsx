"use client";

import { useState } from "react";
import {
  useUsers,
  useConfirmUser,
  useUpdateUser,
  useDeleteUser,
} from "@/lib/hooks/useUsers";
import UserList from "@/components/users/UserList";
import UserFilters from "@/components/users/UserFilters";

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState("");
  const [confirmedFilter, setConfirmedFilter] = useState("");
  const [processingId, setProcessingId] = useState<number | undefined>();

  // Construir parámetros de filtro
  const filterParams: { role?: string; is_confirmed?: boolean } = {};
  if (roleFilter) filterParams.role = roleFilter;
  if (confirmedFilter) filterParams.is_confirmed = confirmedFilter === "true";

  const { data: users, isLoading } = useUsers(
    Object.keys(filterParams).length > 0 ? filterParams : undefined
  );
  const confirmUser = useConfirmUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleConfirm = async (id: number) => {
    if (!confirm("¿Confirmar este usuario?")) return;

    try {
      setProcessingId(id);
      await confirmUser.mutateAsync(id);
    } catch (error) {
      console.error("Error al confirmar usuario:", error);
      alert("Error al confirmar usuario");
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("¿Rechazar y eliminar este usuario?")) return;

    try {
      setProcessingId(id);
      await deleteUser.mutateAsync(id);
    } catch (error) {
      console.error("Error al rechazar usuario:", error);
      alert("Error al rechazar usuario");
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleChangeRole = async (id: number, role: string) => {
    if (!confirm(`¿Cambiar rol a ${role}?`)) return;

    try {
      setProcessingId(id);
      const user = users?.find((u) => u.id === id);
      if (!user) return;

      await updateUser.mutateAsync({
        id,
        data: { ...user, role },
      });
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      alert("Error al cambiar rol");
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      setProcessingId(id);
      await deleteUser.mutateAsync(id);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario");
    } finally {
      setProcessingId(undefined);
    }
  };

  // Estadísticas
  const stats = {
    total: users?.length || 0,
    pending: users?.filter((u) => !u.is_confirmed).length || 0,
    confirmed: users?.filter((u) => u.is_confirmed).length || 0,
    students: users?.filter((u) => u.role === "STUDENT").length || 0,
    professors: users?.filter((u) => u.role === "PROFESSOR").length || 0,
    admins: users?.filter((u) => u.role === "ADMIN").length || 0,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="mt-2 text-gray-600">
          Administra usuarios, confirma registros y gestiona roles
        </p>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 shadow">
          <p className="text-sm text-yellow-700">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 shadow">
          <p className="text-sm text-green-700">Confirmados</p>
          <p className="text-2xl font-bold text-green-900">{stats.confirmed}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 shadow">
          <p className="text-sm text-blue-700">Estudiantes</p>
          <p className="text-2xl font-bold text-blue-900">{stats.students}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 shadow">
          <p className="text-sm text-purple-700">Profesores</p>
          <p className="text-2xl font-bold text-purple-900">
            {stats.professors}
          </p>
        </div>
        <div className="rounded-lg bg-indigo-50 p-4 shadow">
          <p className="text-sm text-indigo-700">Admins</p>
          <p className="text-2xl font-bold text-indigo-900">{stats.admins}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <UserFilters
          roleFilter={roleFilter}
          confirmedFilter={confirmedFilter}
          onRoleChange={setRoleFilter}
          onConfirmedChange={setConfirmedFilter}
        />
      </div>

      {/* Lista de usuarios */}
      <UserList
        users={users || []}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onReject={handleReject}
        onChangeRole={handleChangeRole}
        onDelete={handleDelete}
        processingId={processingId}
      />
    </div>
  );
}
