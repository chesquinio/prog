"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useMyReservations,
  useCancelReservation,
} from "@/lib/hooks/useReservations";
import ReservationList from "@/components/reservations/ReservationList";

export default function ReservationsPage() {
  const { data: reservations, isLoading } = useMyReservations();
  const cancelReservation = useCancelReservation();
  const [cancellingId, setCancellingId] = useState<number | undefined>();

  const handleCancel = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    try {
      setCancellingId(id);
      await cancelReservation.mutateAsync(id);
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert("Error al cancelar la reserva");
    } finally {
      setCancellingId(undefined);
    }
  };

  // Filtrar reservas por estado
  const upcomingReservations = reservations?.filter(
    (r) => new Date(r.start_time) > new Date() && r.status !== "CANCELLED"
  );
  const pastReservations = reservations?.filter(
    (r) => new Date(r.end_time) < new Date() || r.status === "CANCELLED"
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="mt-2 text-gray-600">Gestiona tus reservas de aulas</p>
        </div>
        <Link
          href="/dashboard/reservations/new"
          className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          + Nueva Reserva
        </Link>
      </div>

      {/* Tabs para filtrar */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button className="border-b-2 border-primary-600 px-1 py-4 text-sm font-medium text-primary-600">
            Próximas ({upcomingReservations?.length || 0})
          </button>
          <button className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
            Pasadas ({pastReservations?.length || 0})
          </button>
        </nav>
      </div>

      <ReservationList
        reservations={upcomingReservations || []}
        isLoading={isLoading}
        onCancel={handleCancel}
        cancellingId={cancellingId}
        showRoom={true}
      />
    </div>
  );
}
