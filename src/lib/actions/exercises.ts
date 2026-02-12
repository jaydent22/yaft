"use server";

import { createClient } from "../supabase/server";

export async function searchExercises(query: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  const { data, error } = await supabase
    .from("exercises")
    .select("*, muscles(id, name), equipment(id, name)")
    .or(
      userId
        ? `owner_user_id.is.null,owner_user_id.eq.${userId}`
        : `owner_user_id.is.null`
    )
    .ilike("name", `%${query}%`);

  if (error) {
    throw new Error(`Error searching exercises: ${error.message}`);
  }

  return data;
}
