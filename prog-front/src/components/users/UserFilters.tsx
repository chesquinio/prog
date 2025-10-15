"use client";

interface UserFiltersProps {
  roleFilter: string;
  confirmedFilter: string;
  onRoleChange: (role: string) => void;
  onConfirmedChange: (confirmed: string) => void;
}

export default function UserFilters({
  roleFilter,
  confirmedFilter,
  onRoleChange,
  onConfirmedChange,
}: UserFiltersProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="role-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filtrar por Rol
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Todos los roles</option>
            <option value="STUDENT">Estudiantes</option>
            <option value="PROFESSOR">Profesores</option>
            <option value="ADMIN">Administradores</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="confirmed-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filtrar por Estado
          </label>
          <select
            id="confirmed-filter"
            value={confirmedFilter}
            onChange={(e) => onConfirmedChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Todos los estados</option>
            <option value="true">Confirmados</option>
            <option value="false">Pendientes</option>
          </select>
        </div>
      </div>
    </div>
  );
}
