"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBuilding, useDeleteBuilding } from "@/lib/hooks/useBuildings";
import { useRooms } from "@/lib/hooks/useRooms";
import { formatDate } from "@/lib/utils/date";
import RoomList from "@/components/rooms/RoomList";

export default function BuildingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: building, isLoading } = useBuilding(id);
  const { data: rooms, isLoading: roomsLoading } = useRooms(id);
  const deleteBuilding = useDeleteBuilding();

  const handleDelete = async () => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este edificio? También se eliminarán todas sus aulas."
      )
    ) {
      return;
    }

    try {
      await deleteBuilding.mutateAsync(id);
      router.push("/dashboard/buildings");
    } catch (error) {
      console.error("Error al eliminar edificio:", error);
      alert("Error al eliminar el edificio");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6 h-10 w-64 rounded bg-gray-200" />
        <div className="h-64 rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!building) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <p className="text-gray-600">Edificio no encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{building.name}</h1>
          {building.campus && (
            <p className="mt-2 text-lg text-primary-600">{building.campus}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/buildings/${id}/edit`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteBuilding.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteBuilding.isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Información del Edificio
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {building.address && (
            <>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="text-sm text-gray-900">{building.address}</dd>
            </>
          )}
          <dt className="text-sm font-medium text-gray-500">Creado</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(building.created_at)}
          </dd>
          <dt className="text-sm font-medium text-gray-500">
            Última actualización
          </dt>
          <dd className="text-sm text-gray-900">
            {formatDate(building.updated_at)}
          </dd>
        </dl>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Aulas ({rooms?.length || 0})
          </h2>
          <Link
            href={`/dashboard/rooms/new?building=${id}`}
            className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            + Nueva Aula
          </Link>
        </div>
        <RoomList
          rooms={rooms || []}
          isLoading={roomsLoading}
          showBuilding={false}
        />
      </div>
    </div>
  );
}
