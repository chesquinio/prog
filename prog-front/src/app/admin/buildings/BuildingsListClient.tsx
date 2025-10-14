"use client";

import React, { useState } from "react";
import { Building } from "@/services/buildings";
import { Button } from "@/components/ui/button";
import { useBuildings } from "@/hooks/useBuildings";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

type Props = {
  initial: Building[];
};

export default function BuildingsListClient({ initial }: Props) {
  const {
    data: buildings = initial,
    isLoading,
    remove,
  } = useBuildings(initial);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);

  function confirmDelete(id: number) {
    setTargetId(id);
    setOpen(true);
  }

  async function doDelete() {
    if (!targetId) return;
    try {
      setOpen(false);
      await remove.mutateAsync(targetId);
      await queryClient.invalidateQueries({ queryKey: ["buildings"] });
      toast.success("Edificio eliminado");
    } catch (err: any) {
      toast.error(err?.message || "Error al eliminar");
    } finally {
      setTargetId(null);
    }
  }

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Edificios</h1>
      <div className="mt-4">
        <a
          href="/admin/buildings/create"
          className="inline-block mb-4 text-blue-600"
        >
          Crear edificio
        </a>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Dirección</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((b: Building) => (
              <tr key={b.id} className="border-t">
                <td className="p-2">{b.id}</td>
                <td className="p-2">{b.name}</td>
                <td className="p-2">{b.address}</td>
                <td className="p-2">
                  <a
                    className="mr-2 text-sm text-blue-600"
                    href={`/admin/buildings/${b.id}/edit`}
                  >
                    Editar
                  </a>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => confirmDelete(b.id)}
                    disabled={remove.status === "pending"}
                  >
                    {remove.status === "pending" ? "Eliminando..." : "Eliminar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Seguro que deseas eliminar este edificio? Esta acción no se puede
            deshacer.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={doDelete}>
              {remove.status === "pending" ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
