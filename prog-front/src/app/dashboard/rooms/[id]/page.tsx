"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useRoom, useDeleteRoom } from "@/lib/hooks/useRooms";
import { useBuilding } from "@/lib/hooks/useBuildings";
import { formatDate } from "@/lib/utils/date";

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: room, isLoading } = useRoom(id);
  const { data: building } = useBuilding(room?.building_id || 0);
  const deleteRoom = useDeleteRoom();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta aula?")) {
      return;
    }

    try {
      await deleteRoom.mutateAsync(id);
      router.push("/dashboard/rooms");
    } catch (error) {
      console.error("Error al eliminar aula:", error);
      alert("Error al eliminar el aula");
    }
  };

  // Parsear recursos
  let resources: string[] = [];
  if (room?.resources) {
    try {
      const resourceStr =
        typeof room.resources === "string"
          ? room.resources
          : JSON.stringify(room.resources);
      const parsed = JSON.parse(resourceStr);
      resources = Array.isArray(parsed)
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
        <div className="h-64 rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <p className="text-gray-600">Aula no encontrada</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
          {building && (
            <Link
              href={`/dashboard/buildings/${building.id}`}
              className="mt-2 inline-block text-lg text-primary-600 hover:underline"
            >
              {building.name}
            </Link>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/rooms/${id}/edit`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteRoom.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteRoom.isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Información del Aula
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <dt className="text-sm font-medium text-gray-500">Capacidad</dt>
            <dd className="text-sm text-gray-900">{room.capacity} personas</dd>

            {room.description && (
              <>
                <dt className="text-sm font-medium text-gray-500">
                  Descripción
                </dt>
                <dd className="text-sm text-gray-900">{room.description}</dd>
              </>
            )}

            <dt className="text-sm font-medium text-gray-500">Creado</dt>
            <dd className="text-sm text-gray-900">
              {formatDate(room.created_at)}
            </dd>

            <dt className="text-sm font-medium text-gray-500">
              Última actualización
            </dt>
            <dd className="text-sm text-gray-900">
              {formatDate(room.updated_at)}
            </dd>
          </dl>
        </div>

        {resources.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Recursos Disponibles
            </h2>
            <div className="flex flex-wrap gap-2">
              {resources.map((resource, index) => (
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
    </div>
  );
}
