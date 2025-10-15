"use client";

import Link from "next/link";
import { Room } from "@/lib/types/room";

interface RoomCardProps {
  room: Room;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
  showBuilding?: boolean;
}

export default function RoomCard({
  room,
  onDelete,
  isDeleting = false,
  showBuilding = true,
}: RoomCardProps) {
  // Parsear recursos si es string JSON
  let resources: any = {};
  if (room.resources) {
    try {
      resources =
        typeof room.resources === "string"
          ? JSON.parse(room.resources)
          : room.resources;
    } catch (e) {
      resources = {};
    }
  }

  const resourceKeys = Object.keys(resources);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
        {showBuilding && room.building && (
          <p className="mt-1 text-sm text-primary-600">{room.building.name}</p>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>👥</span>
          <span>Capacidad: {room.capacity} personas</span>
        </div>

        {room.description && (
          <p className="text-sm text-gray-600">{room.description}</p>
        )}

        {resourceKeys.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-gray-700">Recursos:</p>
            <div className="flex flex-wrap gap-2">
              {resourceKeys.slice(0, 4).map((key) => (
                <span
                  key={key}
                  className="rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700"
                >
                  {key}
                </span>
              ))}
              {resourceKeys.length > 4 && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  +{resourceKeys.length - 4} más
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/rooms/${room.id}`}
          className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-center text-sm text-white hover:bg-primary-700"
        >
          Ver Detalles
        </Link>
        <Link
          href={`/dashboard/rooms/${room.id}/edit`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          ✏️
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(room.id)}
            disabled={isDeleting}
            className="rounded-md border border-error px-4 py-2 text-sm text-error hover:bg-error/10 disabled:opacity-50"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
