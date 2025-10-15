"use client";

import { useRouter } from "next/navigation";
import BuildingForm from "@/components/buildings/BuildingForm";
import { useCreateBuilding } from "@/lib/hooks/useBuildings";
import { BuildingFormData } from "@/lib/validations/building";

export default function NewBuildingPage() {
  const router = useRouter();
  const createBuilding = useCreateBuilding();

  const handleSubmit = async (data: BuildingFormData) => {
    try {
      await createBuilding.mutateAsync(data);
      router.push("/dashboard/buildings");
    } catch (error) {
      console.error("Error al crear edificio:", error);
      throw error;
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Edificio</h1>
        <p className="mt-2 text-gray-600">Crea un nuevo edificio del campus</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <BuildingForm
          onSubmit={handleSubmit}
          isLoading={createBuilding.isPending}
        />
      </div>
    </div>
  );
}
