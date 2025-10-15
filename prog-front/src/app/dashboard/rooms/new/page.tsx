"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RoomForm from "@/components/rooms/RoomForm";
import { useCreateRoom } from "@/lib/hooks/useRooms";
import { RoomFormData } from "@/lib/validations/room";

export default function NewRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buildingId = searchParams.get("building");

  const createRoom = useCreateRoom();

  const handleSubmit = async (data: RoomFormData) => {
    try {
      await createRoom.mutateAsync(data);

      // Redirigir al edificio si venimos de ahí, sino a la lista de aulas
      if (buildingId) {
        router.push(`/dashboard/buildings/${buildingId}`);
      } else {
        router.push("/dashboard/rooms");
      }
    } catch (error) {
      console.error("Error al crear aula:", error);
      throw error;
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nueva Aula</h1>
        <p className="mt-2 text-gray-600">Crea una nueva aula en un edificio</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <RoomForm
          onSubmit={handleSubmit}
          isLoading={createRoom.isPending}
          preselectedBuildingId={buildingId ? Number(buildingId) : undefined}
        />
      </div>
    </div>
  );
}
