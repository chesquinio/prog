"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useReservation,
  useCancelReservation,
  useDeleteReservation,
} from "@/lib/hooks/useReservations";
import { useAuthStore } from "@/lib/store/authStore";
import { formatDateTime, formatTime, formatDate } from "@/lib/utils/date";
import Link from "next/link";

export default function ReservationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: reservation, isLoading } = useReservation(id);
  const cancelReservation = useCancelReservation();
  const deleteReservation = useDeleteReservation();
  const { user } = useAuthStore();

  const isOwner = reservation?.user_id === user?.id;
  const isAdmin = user?.role === "ADMIN";
  const isPast = reservation
    ? new Date(reservation.end_time) < new Date()
    : false;
  const isCancelled = reservation?.status === "CANCELLED";

  const handleCancel = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    try {
      await cancelReservation.mutateAsync(id);
      router.push("/dashboard/reservations");
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert("Error al cancelar la reserva");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      return;
    }

    try {
      await deleteReservation.mutateAsync(id);
      router.push("/dashboard/reservations");
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      alert("Error al eliminar la reserva");
    }
  };

  // Parsear recursos del aula
  let roomResources: string[] = [];
  if (reservation?.room?.resources) {
    try {
      const resourceStr =
        typeof reservation.room.resources === "string"
          ? reservation.room.resources
          : JSON.stringify(reservation.room.resources);
      const parsed = JSON.parse(resourceStr);
      roomResources = Array.isArray(parsed)
        ? parsed.map((r) => (typeof r === "string" ? r : r.name || ""))
        : [];
    } catch (e) {
      console.error("Error al parsear recursos:", e);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6 h-10 w-64 rounded bg-gray-200" />
        <div className="h-96 rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <p className="text-gray-600">Reserva no encontrada</p>
      </div>
    );
  }

  const getStatusInfo = () => {
    if (isCancelled) {
      return { text: "Cancelada", color: "bg-gray-100 text-gray-800" };
    }
    if (isPast) {
      return { text: "Finalizada", color: "bg-blue-100 text-blue-800" };
    }
    if (
      new Date(reservation.start_time) <= new Date() &&
      new Date(reservation.end_time) >= new Date()
    ) {
      return { text: "En curso", color: "bg-green-100 text-green-800" };
    }
    return { text: "Próxima", color: "bg-yellow-100 text-yellow-800" };
  };

  const status = getStatusInfo();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reserva #{reservation.id}
          </h1>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${status.color}`}
          >
            {status.text}
          </span>
        </div>
        <div className="flex gap-2">
          {isOwner && !isCancelled && !isPast && (
            <>
              <Link
                href={`/dashboard/reservations/${id}/edit`}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Editar
              </Link>
              <button
                onClick={handleCancel}
                disabled={cancelReservation.isPending}
                className="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                {cancelReservation.isPending
                  ? "Cancelando..."
                  : "Cancelar Reserva"}
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={deleteReservation.isPending}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteReservation.isPending ? "Eliminando..." : "Eliminar"}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Información del Aula */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Información del Aula
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <dt className="text-sm font-medium text-gray-500">Aula</dt>
            <dd className="text-sm text-gray-900">
              <Link
                href={`/dashboard/rooms/${reservation.room_id}`}
                className="text-primary-600 hover:underline"
              >
                {reservation.room?.name}
              </Link>
            </dd>

            {reservation.room?.building && (
              <>
                <dt className="text-sm font-medium text-gray-500">Edificio</dt>
                <dd className="text-sm text-gray-900">
                  <Link
                    href={`/dashboard/buildings/${reservation.room.building.id}`}
                    className="text-primary-600 hover:underline"
                  >
                    {reservation.room.building.name}
                  </Link>
                </dd>
              </>
            )}

            {reservation.room?.capacity && (
              <>
                <dt className="text-sm font-medium text-gray-500">Capacidad</dt>
                <dd className="text-sm text-gray-900">
                  {reservation.room.capacity} personas
                </dd>
              </>
            )}
          </dl>

          {roomResources.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                Recursos Disponibles
              </h3>
              <div className="flex flex-wrap gap-2">
                {roomResources.map((resource, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Información de la Reserva */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Detalles de la Reserva
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <dt className="text-sm font-medium text-gray-500">Fecha</dt>
            <dd className="text-sm text-gray-900">
              {formatDate(reservation.start_time)}
            </dd>

            <dt className="text-sm font-medium text-gray-500">
              Hora de Inicio
            </dt>
            <dd className="text-sm text-gray-900">
              {formatTime(reservation.start_time)}
            </dd>

            <dt className="text-sm font-medium text-gray-500">Hora de Fin</dt>
            <dd className="text-sm text-gray-900">
              {formatTime(reservation.end_time)}
            </dd>

            {reservation.user && (
              <>
                <dt className="text-sm font-medium text-gray-500">
                  Reservado por
                </dt>
                <dd className="text-sm text-gray-900">
                  {reservation.user.name} ({reservation.user.email})
                </dd>
              </>
            )}

            <dt className="text-sm font-medium text-gray-500">Creado</dt>
            <dd className="text-sm text-gray-900">
              {formatDateTime(reservation.created_at)}
            </dd>

            {reservation.purpose && (
              <>
                <dt className="text-sm font-medium text-gray-500">Propósito</dt>
                <dd className="col-span-2 text-sm text-gray-900">
                  {reservation.purpose}
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
