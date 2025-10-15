"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRooms, useDeleteRoom } from "@/lib/hooks/useRooms";
import { useBuildings } from "@/lib/hooks/useBuildings";
import RoomList from "@/components/rooms/RoomList";

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const buildingFilter = searchParams.get("building");

  const { data: rooms, isLoading } = useRooms(
    buildingFilter ? Number(buildingFilter) : undefined
  );
  const { data: buildings } = useBuildings();
  const deleteRoom = useDeleteRoom();
  const [deletingId, setDeletingId] = useState<number | undefined>();

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta aula?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteRoom.mutateAsync(id);
    } catch (error) {
      console.error("Error al eliminar aula:", error);
      alert("Error al eliminar el aula");
    } finally {
      setDeletingId(undefined);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
          <p className="mt-2 text-gray-600">Gestiona las aulas del campus</p>
        </div>
        <Link
          href="/dashboard/rooms/new"
          className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          + Nueva Aula
        </Link>
      </div>

      {buildings && buildings.length > 0 && (
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <label
            htmlFor="building-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filtrar por edificio
          </label>
          <select
            id="building-filter"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={buildingFilter || ""}
            onChange={(e) => {
              const url = new URL(window.location.href);
              if (e.target.value) {
                url.searchParams.set("building", e.target.value);
              } else {
                url.searchParams.delete("building");
              }
              window.history.pushState({}, "", url);
              window.location.reload();
            }}
          >
            <option value="">Todos los edificios</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <RoomList
        rooms={rooms || []}
        isLoading={isLoading}
        onDelete={handleDelete}
        deletingId={deletingId}
        showBuilding={!buildingFilter}
      />
    </div>
  );
}
