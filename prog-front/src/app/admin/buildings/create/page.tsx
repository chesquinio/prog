"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBuilding } from "@/services/buildings";

export default function CreateBuildingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createBuilding({ name, address });
      router.push("/admin/buildings");
    } catch (err: any) {
      setError(err?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Crear edificio</h1>
      <form onSubmit={onSubmit} className="mt-4 max-w-md">
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Dirección</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear"}
        </Button>
      </form>
    </div>
  );
}
