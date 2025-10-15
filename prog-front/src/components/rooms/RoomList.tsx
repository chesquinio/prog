"use client";

import { Room } from "@/lib/types/room";
import RoomCard from "./RoomCard";

interface RoomListProps {
  rooms: Room[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  deletingId?: number;
  showBuilding?: boolean;
}

export default function RoomList({
  rooms,
  isLoading = false,
  onDelete,
  deletingId,
  showBuilding = true,
}: RoomListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <span className="text-3xl">🚪</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No hay aulas aún
        </h3>
        <p className="mb-6 text-gray-600">Comienza creando la primera aula.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onDelete={onDelete}
          isDeleting={deletingId === room.id}
          showBuilding={showBuilding}
        />
      ))}
    </div>
  );
}
