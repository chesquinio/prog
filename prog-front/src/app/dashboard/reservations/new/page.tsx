"use client";

import { useRouter } from "next/navigation";
import ReservationForm from "@/components/reservations/ReservationForm";
import { useCreateReservation } from "@/lib/hooks/useReservations";
import { ReservationFormData } from "@/lib/validations/reservation";

export default function NewReservationPage() {
  const router = useRouter();
  const createReservation = useCreateReservation();

  const handleSubmit = async (data: ReservationFormData) => {
    try {
      await createReservation.mutateAsync(data);
      router.push("/dashboard/reservations");
    } catch (error) {
      console.error("Error al crear reserva:", error);
      throw error;
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
        <p className="mt-2 text-gray-600">Reserva un aula para tu actividad</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <ReservationForm
          onSubmit={handleSubmit}
          isLoading={createReservation.isPending}
        />
      </div>
    </div>
  );
}
