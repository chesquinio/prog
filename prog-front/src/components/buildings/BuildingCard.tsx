"use client";

import Link from "next/link";
import { Building } from "@/lib/types/building";
import { formatDate } from "@/lib/utils/date";

interface BuildingCardProps {
  building: Building;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
  roomCount?: number;
}

export default function BuildingCard({
  building,
  onDelete,
  isDeleting = false,
  roomCount,
}: BuildingCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{building.name}</h3>
        {building.campus && (
          <p className="mt-1 text-sm text-primary-600">{building.campus}</p>
        )}
      </div>

      {building.address && (
        <p className="mb-4 text-sm text-gray-600">📍 {building.address}</p>
      )}

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
        {roomCount !== undefined && (
          <div className="flex items-center gap-1">
            <span>🚪</span>
            <span>
              {roomCount} {roomCount === 1 ? "aula" : "aulas"}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span>📅</span>
          <span>{formatDate(building.created_at)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/buildings/${building.id}`}
          className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-center text-sm text-white hover:bg-primary-700"
        >
          Ver Detalles
        </Link>
        <Link
          href={`/dashboard/buildings/${building.id}/rooms`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          🚪 Aulas
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(building.id)}
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
