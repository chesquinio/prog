"use client";

import { useState } from "react";
import Link from "next/link";
import { useBuildings, useDeleteBuilding } from "@/lib/hooks/useBuildings";
import { useRooms } from "@/lib/hooks/useRooms";
import BuildingList from "@/components/buildings/BuildingList";

export default function BuildingsPage() {
  const { data: buildings, isLoading } = useBuildings();
  const { data: allRooms } = useRooms();
  const deleteBuilding = useDeleteBuilding();
  const [deletingId, setDeletingId] = useState<number | undefined>();

  // Contar aulas por edificio
  const roomCounts = allRooms?.reduce((acc, room) => {
    acc[room.building_id] = (acc[room.building_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este edificio?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteBuilding.mutateAsync(id);
    } catch (error) {
      console.error("Error al eliminar edificio:", error);
      alert("Error al eliminar el edificio");
    } finally {
      setDeletingId(undefined);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edificios</h1>
          <p className="mt-2 text-gray-600">
            Gestiona los edificios del campus
          </p>
        </div>
        <Link
          href="/dashboard/buildings/new"
          className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          + Nuevo Edificio
        </Link>
      </div>

      <BuildingList
        buildings={buildings || []}
        isLoading={isLoading}
        onDelete={handleDelete}
        deletingId={deletingId}
        roomCounts={roomCounts}
      />
    </div>
  );
}
