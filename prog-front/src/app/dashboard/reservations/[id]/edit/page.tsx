"use client";

import { useParams, useRouter } from "next/navigation";
import ReservationForm from "@/components/reservations/ReservationForm";
import {
  useReservation,
  useUpdateReservation,
} from "@/lib/hooks/useReservations";
import { useAuthStore } from "@/lib/store/authStore";
import { ReservationFormData } from "@/lib/validations/reservation";

export default function EditReservationPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: reservation, isLoading } = useReservation(id);
  const updateReservation = useUpdateReservation(id);
  const { user } = useAuthStore();

  const isOwner = reservation?.user_id === user?.id;
  const isPast = reservation
    ? new Date(reservation.end_time) < new Date()
    : false;
  const isCancelled = reservation?.status === "CANCELLED";

  const handleSubmit = async (data: ReservationFormData) => {
    try {
      await updateReservation.mutateAsync(data);
      router.push(`/dashboard/reservations/${id}`);
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="mb-6 h-10 w-64 rounded bg-gray-200" />
        <div className="h-96 rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-600">Reserva no encontrada</p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-600">
            No tienes permiso para editar esta reserva
          </p>
        </div>
      </div>
    );
  }

  if (isPast || isCancelled) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-600">
            No se puede editar una reserva{" "}
            {isCancelled ? "cancelada" : "pasada"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Reserva</h1>
        <p className="mt-2 text-gray-600">Reserva #{reservation.id}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <ReservationForm
          initialData={reservation}
          onSubmit={handleSubmit}
          isLoading={updateReservation.isPending}
        />
      </div>
    </div>
  );
}
