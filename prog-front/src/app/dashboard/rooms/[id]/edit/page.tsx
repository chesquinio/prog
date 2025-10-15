"use client";

import { useParams, useRouter } from "next/navigation";
import RoomForm from "@/components/rooms/RoomForm";
import { useRoom, useUpdateRoom } from "@/lib/hooks/useRooms";
import { RoomFormData } from "@/lib/validations/room";

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: room, isLoading } = useRoom(id);
  const updateRoom = useUpdateRoom(id);

  const handleSubmit = async (data: RoomFormData) => {
    try {
      await updateRoom.mutateAsync(data);
      router.push(`/dashboard/rooms/${id}`);
    } catch (error) {
      console.error("Error al actualizar aula:", error);
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

  if (!room) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-600">Aula no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Aula</h1>
        <p className="mt-2 text-gray-600">{room.name}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <RoomForm
          initialData={room}
          onSubmit={handleSubmit}
          isLoading={updateRoom.isPending}
        />
      </div>
    </div>
  );
}
