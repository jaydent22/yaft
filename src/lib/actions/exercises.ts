"use server";

import { createClient } from "../supabase/server";

export async function searchExercises({
  query,
  muscleId,
  groupId,
  equipmentId,
}: {
  query: string;
  muscleId?: string;
  groupId?: string;
  equipmentId?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  let request = supabase.from("exercise_search_view").select("*");

  if (query.trim()) {
    request = request.or(
      `name.ilike.%${query}%,muscle_name.ilike.%${query}%,muscle_group_name.ilike.%${query}%,equipment_name.ilike.%${query}%`
    );
  }

  if (userId) {
    request = request.or(`owner_user_id.is.null,owner_user_id.eq.${userId}`);
  } else {
    request = request.is("owner_user_id", null);
  }

  if (muscleId) {
    request = request.eq("muscle_id", muscleId);
  }

  if (groupId && !muscleId) {
    request = request.eq("muscle_group_id", groupId);
  }

  if (equipmentId) {
    request = request.eq("equipment_id", equipmentId);
  }

  const { data, error } = await request;
  if (error) {
    throw new Error(`Error searching exercises: ${error.message}`);
  }

  return data;
}
