"use server";

import { createClient } from "../../../lib/supabase/server";
import WorkoutClient from "../../../components/workout/WorkoutClient";
import type { Enums } from "../../../types/database";

export default async function Workout() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: workout } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("user_id", user?.id)
    .in("status", ["draft", "active"])
    .maybeSingle();
  return <WorkoutClient existingWorkout={workout} />;
}
