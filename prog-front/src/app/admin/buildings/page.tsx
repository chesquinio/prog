export const dynamic = "force-dynamic";

import { listBuildings, Building } from "@/services/buildings";
import BuildingsListClient from "./BuildingsListClient";

export default async function BuildingsPage() {
  const buildings: Building[] = await listBuildings();

  return <BuildingsListClient initial={buildings} />;
}
