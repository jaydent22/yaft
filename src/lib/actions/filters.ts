import { createClient } from "../supabase/server";
import type { Tables } from "../../types/database";

export type MuscleGroupWithMuscles = Tables<"muscle_groups"> & {
  muscles: Pick<Tables<"muscles">, "id" | "name">[];
};

export async function getMuscleGroups() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("muscle_groups")
    .select("*, muscles(id, name)");

  if (error) {
    throw new Error(`Error fetching muscles: ${error.message}`);
  }
  return data;
}

export async function getEquipment() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("equipment").select("*");

  if (error) {
    throw new Error(`Error fetching equipment: ${error.message}`);
  }

  return data;
}
