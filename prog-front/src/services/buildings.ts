import axios from "../lib/axios";

export type Building = {
  id: number;
  name: string;
  address?: string;
  campus?: string;
};

export const listBuildings = async (): Promise<Building[]> => {
  const res = await axios.get("/buildings");
  return res.data;
};

export const createBuilding = async (payload: {
  name: string;
  address?: string;
  campus?: string;
}) => {
  const res = await axios.post("/buildings", payload);
  return res.data;
};

export const deleteBuilding = async (id: number) => {
  const res = await axios.delete(`/buildings/${id}`);
  return res.data;
};
