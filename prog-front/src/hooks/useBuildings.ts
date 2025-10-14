"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listBuildings,
  createBuilding,
  deleteBuilding,
} from "@/services/buildings";
import type { Building } from "@/services/buildings";

export function useBuildings(initial: Building[] = []) {
  const queryClient = useQueryClient();

  const query = useQuery<Building[], Error>({
    queryKey: ["buildings"],
    queryFn: () => listBuildings(),
    initialData: initial,
  });

  const createFn = (payload: { name: string; address?: string }) =>
    createBuilding(payload);

  const create = useMutation<any, Error, { name: string; address?: string }>(
    createFn as any
  );

  const removeFn = (id: number) => deleteBuilding(id);
  const remove = useMutation<any, Error, number>(removeFn as any);

  return {
    ...query,
    create,
    remove,
  };
}
