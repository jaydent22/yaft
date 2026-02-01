"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ExerciseDay } from "./ProgramEditor";

import { createClient } from "../../lib/supabase/server";

const ProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  days: z.array(
    z.discriminatedUnion("type", [
      z.object({
        id: z.string().optional(),
        type: z.literal("rest"),
        dayNumber: z.number(),
      }),
      z.object({
        id: z.string().optional(),
        type: z.literal("exercise"),
        name: z.string().optional(),
        dayNumber: z.number(),
        exercises: z.array(
          z.object({
            id: z.string().optional(),
            exerciseId: z.string(),
            sets: z.number().min(1),
            reps: z.number().min(1),
            sortOrder: z.number(),
          })
        ),
      }),
    ])
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
  const exercisesToInsert: any[] = [];
  program?.days.forEach((day) => {
    if (day.type === "exercise") {
      const dayId = daysData?.find((d) => d.day_number === day.dayNumber)?.id;
      if (!dayId) return;

      day.exercises?.forEach((exercise) => {
        exercisesToInsert.push({
          program_day_id: dayId,
          exercise_id: exercise.exerciseId,
          target_sets: exercise.sets,
          target_reps: exercise.reps,
          sort_order: exercise.sortOrder,
        });
      });
    }
  });

  if (exercisesToInsert.length > 0) {
    const { error: exercisesError } = await supabase
      .from("program_day_exercises")
      .insert(exercisesToInsert);

    if (exercisesError) {
      throw exercisesError;
    }
  }

  revalidatePath("/programs");
  redirect("/programs");
}

export async function editProgram(formData: FormData, programId: string) {
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
  if (!parsedProgram.success) {
    throw new Error("Invalid program schema");
  }
  const program = parsedProgram.data;

  const { error: programError } = await supabase
    .from("programs")
    .update({
      name: program?.name,
      description: program?.description,
    })
    .eq("id", programId)
    .eq("user_id", userId);
  if (programError) {
    throw programError;
  }

  // Fetch existing program days
  const { data: existingDays } = await supabase
    .from("program_days")
    .select("id")
    .eq("program_id", programId);

  if (!existingDays) {
    throw new Error("Failed to fetch existing program days");
  }

  const existingDayIds = existingDays.map((day) => day.id);

  // Upsert program days
  const daysToUpsert = program?.days.map((day) => {
    const row: any = {
      program_id: programId,
      name: day.type === "exercise" ? day.name : "Rest Day",
      day_number: day.dayNumber,

    };
    if (day.id) {
      row.id = day.id;
    }
    return row;
  });

  // split insert and update to avoid conflict issues
  const daysToInsert = daysToUpsert.filter((day) => !day.id);
  const daysToUpdate = daysToUpsert.filter((day) => day.id);

  let insertedDays: { id: string, day_number: number }[] = [];
  if (daysToInsert.length > 0) {
    const { data, error: insertDaysError } = await supabase
      .from("program_days")
      .insert(daysToInsert)
      .select("id, day_number");
    if (insertDaysError) {
      throw insertDaysError;
    }
    insertedDays = data;
  }

  let updatedDays: { id: string, day_number: number }[] = [];
  if (daysToUpdate.length > 0) {
    const { data, error: updateDaysError } = await supabase
      .from("program_days")
      .upsert(daysToUpdate, { onConflict: "id"})
      .select("id, day_number");
    if (updateDaysError) {
      throw updateDaysError;
    }
    updatedDays = data;
  }

  // reconstructed upsertedDays for map
  const upsertedDays = [...insertedDays, ...updatedDays];

  // Delete days (if necessary)
  const incomingDayIds = new Set(
    daysToUpsert?.filter((day) => day.id).map((day) => day.id!) || []
  );
  const dayIdsToDelete = [...existingDayIds].filter(
    (id) => !incomingDayIds.has(id)
  );

  if (dayIdsToDelete.length > 0) {
    await supabase.from("program_days").delete().in("id", dayIdsToDelete);
  }

  // Fetch existing exercises
  const upsertedDayIds = upsertedDays.map((day) => day.id);
  const dayNumberToIdMap = new Map<number, string>(
    upsertedDays.map((day) => [day.day_number, day.id])
  );
  const { data: existingExercises } = await supabase
    .from("program_day_exercises")
    .select("id, program_day_id")
    .in("program_day_id", upsertedDayIds);

  const existingExerciseIds = existingExercises?.map((ex) => ex.id) || [];

  // Upsert program day exercises
  const exercisesToUpsert = program?.days
    .filter((day): day is ExerciseDay => day.type === "exercise")
    .flatMap((day) =>
      day.exercises.map((ex) => {
        const row: any = {
          program_day_id: dayNumberToIdMap.get(day.dayNumber)!,
          exercise_id: ex.exerciseId,
          target_sets: ex.sets,
          target_reps: ex.reps,
          sort_order: ex.sortOrder,
        };
        if (ex.id) {
          row.id = ex.id;
        }
        return row;
      })
    );

    // split insert and update to avoid conflict issues
    const exercisesToInsert = exercisesToUpsert.filter((ex) => !ex.id);
    const exercisesToUpdate = exercisesToUpsert.filter((ex) => ex.id);

    if (exercisesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("program_day_exercises")
        .insert(exercisesToInsert);
      if (insertError) {
        throw insertError;
      }
    }

    if (exercisesToUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from("program_day_exercises")
        .upsert(exercisesToUpdate, { onConflict: "id" });
      if (updateError) {
        throw updateError;
      }
    }

  // Delete exercises (if necessary)
  const incomingExerciseIds = new Set(
    exercisesToUpsert?.filter((ex) => ex.id).map((ex) => ex.id!) || []
  );

  const exerciseIdsToDelete = existingExerciseIds!.filter(
    (id) => !incomingExerciseIds.has(id)
  );

  if (exerciseIdsToDelete.length > 0) {
    await supabase
      .from("program_day_exercises")
      .delete()
      .in("id", exerciseIdsToDelete);
  }

  revalidatePath("/programs");
  redirect("/programs");
}

export async function deleteProgram(programId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId)
    .eq("user_id", userId);
  if (error) {
    throw error;
  }

  revalidatePath("/programs");
  redirect("/programs");
}
