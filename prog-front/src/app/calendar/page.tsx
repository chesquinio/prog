"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useBuildings } from "@/lib/hooks/useBuildings";
import { useDailySchedule } from "@/lib/hooks/useCalendar";
import CalendarView from "@/components/calendar/CalendarView";
import DaySchedule from "@/components/calendar/DaySchedule";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBuilding, setSelectedBuilding] = useState<
    number | undefined
  >();

  const { data: buildings } = useBuildings();
  const { rooms, reservations, isLoading } = useDailySchedule(
    format(selectedDate, "yyyy-MM-dd"),
    selectedBuilding
  );

  // Contar reservas por día para el calendario
  const reservationCounts: Record<string, number> = {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Calendario Público de Aulas
              </h1>
              <p className="mt-2 text-gray-600">
                Consulta la disponibilidad de aulas en tiempo real
              </p>
            </div>
            <Link
              href="/auth/login"
              className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Calendario */}
          <div className="lg:col-span-1">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              reservationCounts={reservationCounts}
            />

            {/* Filtro por Edificio */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow">
              <label
                htmlFor="building-filter"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Filtrar por Edificio
              </label>
              <select
                id="building-filter"
                value={selectedBuilding || ""}
                onChange={(e) =>
                  setSelectedBuilding(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todos los edificios</option>
                {buildings?.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Leyenda */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Leyenda
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-50 ring-1 ring-green-200" />
                  <span className="text-gray-700">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-red-50 ring-1 ring-red-200" />
                  <span className="text-gray-700">Reservado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Horario del Día */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </h2>
              <p className="mt-1 text-gray-600">
                {rooms.length} aula(s) • {reservations.length} reserva(s)
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-lg bg-white p-12 text-center shadow">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
                <p className="mt-4 text-gray-600">Cargando horarios...</p>
              </div>
            ) : (
              <DaySchedule
                date={selectedDate}
                rooms={rooms}
                reservations={reservations}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Sistema de Reservas de Aulas Universitarias •{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
