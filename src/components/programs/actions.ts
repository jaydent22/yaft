"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "../../lib/supabase/server";

const ProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  days: z.array(
    z.object({
      type: z.enum(["exercise", "rest"]),
      name: z.string().optional(),
      dayNumber: z.number(),
      exercises: z
        .array(
          z.object({
            id: z.string(),
            sets: z.number().min(1),
            reps: z.number().min(1),
            sortOrder: z.number(),
          })
        )
        .optional(),
    })
  ),
});

export async function createProgram(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const programJson = formData.get("program");
  if (!programJson || typeof programJson !== "string") {
    throw new Error("Invalid program data");
  }

  const parsedProgram = ProgramSchema.safeParse(JSON.parse(programJson));
  const program = parsedProgram.success ? parsedProgram.data : null;

  // Insert program
  const { data: programData, error: programError } = await supabase
    .from("programs")
    .insert({
      name: program?.name,
      description: program?.description,
      user_id: userId,
    })
    .select()
    .single();

  if (programError) {
    throw programError;
  }

  const programId = programData.id;

  // Insert program days
  const daysToInsert = program?.days.map((day) => ({
    program_id: programId,
    name: day.type === "exercise" ? day.name : "Rest Day",
    day_number: day.dayNumber,
  }));

  const { data: daysData, error: daysError } = await supabase
    .from("program_days")
    .insert(daysToInsert)
    .select();

  if (daysError) {
    throw daysError;
  }

  // Insert exercises for exercise days
  const exercisesToinsert: any[] = [];
  program?.days.forEach((day) => {
    if (day.type === "exercise") {
      const dayId = daysData?.find((d) => d.day_number === day.dayNumber)?.id;
      if (!dayId) return;

      day.exercises?.forEach((exercise) => {
        exercisesToinsert.push({
          program_day_id: dayId,
          exercise_id: exercise.id,
          target_sets: exercise.sets,
          target_reps: exercise.reps,
          sort_order: exercise.sortOrder,
        });
      });
    }
  });

  if (exercisesToinsert.length > 0) {
    const { error: exercisesError } = await supabase
      .from("program_day_exercises")
      .insert(exercisesToinsert);

    if (exercisesError) {
      throw exercisesError;
    }
  }

  revalidatePath("/programs");
  redirect("/programs");
}
