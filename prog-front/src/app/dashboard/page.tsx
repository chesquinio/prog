"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { formatRole } from "@/lib/utils/format";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido, {user.name} ({formatRole(user.role)})
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">
            {user.role === "ADMIN" ? "Usuarios Pendientes" : "Mis Clases"}
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">-</p>
          <p className="mt-1 text-sm text-gray-500">Próximamente</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">Reservas</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">-</p>
          <p className="mt-1 text-sm text-gray-500">Próximamente</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">
            {user.role === "ADMIN" ? "Aulas Disponibles" : "Próximas Clases"}
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">-</p>
          <p className="mt-1 text-sm text-gray-500">Próximamente</p>
        </div>
      </div>
    </div>
  );
}
