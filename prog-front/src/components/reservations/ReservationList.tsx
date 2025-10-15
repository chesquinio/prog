"use client";

import { Reservation } from "@/lib/types/reservation";
import ReservationCard from "./ReservationCard";

interface ReservationListProps {
  reservations: Reservation[];
  isLoading?: boolean;
  onCancel?: (id: number) => void;
  onDelete?: (id: number) => void;
  cancellingId?: number;
  deletingId?: number;
  showUser?: boolean;
  showRoom?: boolean;
}

export default function ReservationList({
  reservations,
  isLoading = false,
  onCancel,
  onDelete,
  cancellingId,
  deletingId,
  showUser = false,
  showRoom = true,
}: ReservationListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <span className="text-3xl">📅</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No hay reservas
        </h3>
        <p className="mb-6 text-gray-600">
          Comienza creando tu primera reserva de aula.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onCancel={onCancel}
          onDelete={onDelete}
          isCancelling={cancellingId === reservation.id}
          isDeleting={deletingId === reservation.id}
          showUser={showUser}
          showRoom={showRoom}
        />
      ))}
    </div>
  );
}
