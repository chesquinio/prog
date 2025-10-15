"use client";

import { useParams, useRouter } from "next/navigation";
import BuildingForm from "@/components/buildings/BuildingForm";
import { useBuilding, useUpdateBuilding } from "@/lib/hooks/useBuildings";
import { BuildingFormData } from "@/lib/validations/building";

export default function EditBuildingPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: building, isLoading } = useBuilding(id);
  const updateBuilding = useUpdateBuilding(id);

  const handleSubmit = async (data: BuildingFormData) => {
    try {
      await updateBuilding.mutateAsync(data);
      router.push(`/dashboard/buildings/${id}`);
    } catch (error) {
      console.error("Error al actualizar edificio:", error);
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

  if (!building) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-600">Edificio no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Edificio</h1>
        <p className="mt-2 text-gray-600">{building.name}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <BuildingForm
          initialData={building}
          onSubmit={handleSubmit}
          isLoading={updateBuilding.isPending}
        />
      </div>
    </div>
  );
}
