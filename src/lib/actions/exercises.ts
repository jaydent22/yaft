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
    .select("*")
    .or(
      userId
        ? `owner_user_id.is.null,owner_user_id.eq.${userId}`
        : `owner_user_id.is.null`
    )
    .ilike("name", `%${query}%`)
    .limit(5);

  if (error) {
    throw new Error(`Error searching exercises: ${error.message}`);
  }

  return data;
}
