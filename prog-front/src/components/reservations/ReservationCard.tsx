"use client";

import Link from "next/link";
import { Reservation } from "@/lib/types/reservation";
import { formatDateTime, formatTime } from "@/lib/utils/date";

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: number) => void;
  onDelete?: (id: number) => void;
  isCancelling?: boolean;
  isDeleting?: boolean;
  showUser?: boolean;
  showRoom?: boolean;
}

export default function ReservationCard({
  reservation,
  onCancel,
  onDelete,
  isCancelling = false,
  isDeleting = false,
  showUser = false,
  showRoom = true,
}: ReservationCardProps) {
  const isPast = new Date(reservation.end_time) < new Date();
  const isActive =
    new Date(reservation.start_time) <= new Date() &&
    new Date(reservation.end_time) >= new Date();
  const isCancelled = reservation.status === "CANCELLED";

  const getStatusBadge = () => {
    if (isCancelled) {
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
          Cancelada
        </span>
      );
    }
    if (isPast) {
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
          Finalizada
        </span>
      );
    }
    if (isActive) {
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
          En curso
        </span>
      );
    }
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
        Próxima
      </span>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          {showRoom && reservation.room && (
            <h3 className="text-xl font-semibold text-gray-900">
              {reservation.room.name}
            </h3>
          )}
          {showRoom && reservation.room?.building && (
            <p className="mt-1 text-sm text-primary-600">
              {reservation.room.building.name}
            </p>
          )}
          {showUser && reservation.user && (
            <p className="mt-1 text-sm text-gray-600">
              Reservado por: {reservation.user.name}
            </p>
          )}
        </div>
        {getStatusBadge()}
      </div>

      <div className="mb-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{formatDateTime(reservation.start_time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🕐</span>
          <span>
            {formatTime(reservation.start_time)} -{" "}
            {formatTime(reservation.end_time)}
          </span>
        </div>
        {reservation.purpose && (
          <div className="flex items-start gap-2">
            <span>📝</span>
            <span className="flex-1">{reservation.purpose}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/reservations/${reservation.id}`}
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
        >
          Ver Detalles
        </Link>
        {onCancel && !isCancelled && !isPast && (
          <button
            onClick={() => onCancel(reservation.id)}
            disabled={isCancelling}
            className="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            {isCancelling ? "Cancelando..." : "Cancelar"}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(reservation.id)}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        )}
      </div>
    </div>
  );
}
