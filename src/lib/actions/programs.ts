"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type {
  ExerciseDay,
  ProgramDraft,
} from "../../components/programs/ProgramEditor";
import type { Tables, TablesInsert, TablesUpdate } from "../../types/database";
import { DayTypeEnum } from "../enums";
import { createClient } from "../supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

type ProgramDayQueryResult = Tables<"program_days"> & {
  program_day_exercises: (Tables<"program_day_exercises"> & {
    exercises: Pick<Tables<"exercises">, "id" | "name">;
  })[];
};

export type ProgramActionState = {
  success: boolean;
  fieldErrors?: Record<string, string>;
  formError?: string;
};

const ProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  days: z
    .array(
      z.discriminatedUnion("dayType", [
        z.object({
          id: z.string().optional(),
          dayType: z.literal("rest"),
          dayNumber: z.number(),
        }),
        z.object({
          id: z.string().optional(),
          dayType: z.literal("exercise"),
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
    )
    .min(1, "At least one day is required"),
});

function normalizeProgram(
  program: Tables<"programs">,
  programDays: ProgramDayQueryResult[]
): ProgramDraft {
  return {
    name: program.name,
    description: program.description?.toString() || "",
    days: programDays.map((day) => {
      if (day.day_type === "rest") {
        return {
          clientId: crypto.randomUUID(),
          id: day.id,
          dayType: "rest",
          dayNumber: day.day_number,
        };
      } else {
        return {
          clientId: crypto.randomUUID(),
          id: day.id,
          dayType: "exercise",
          name: day.name,
          dayNumber: day.day_number,
          exercises: day.program_day_exercises
            .filter((ex) => ex.program_day_id === day.id)
            .map((ex) => ({
              clientId: crypto.randomUUID(),
              id: ex.id,
              exerciseId: ex.exercise_id,
              name: ex.exercises.name,
              sets: ex.target_sets,
              reps: ex.target_reps,
              sortOrder: ex.sort_order,
            })),
        };
      }
    }),
  };
}

async function insertDays(
  supabase: SupabaseClient,
  programDays: z.infer<typeof ProgramSchema>["days"],
  programId: string
): Promise<{
  success: boolean;
  data?: Tables<"program_days">[];
  error?: string;
}> {
  const daysToInsert = programDays.map((day) => ({
    program_id: programId,
    name: day.dayType === DayTypeEnum.enum.exercise ? day.name : "Rest Day",
    day_number: day.dayNumber,
    day_type: day.dayType,
  }));

  const { data, error: daysError } = await supabase
    .from("program_days")
    .insert(daysToInsert)
    .select();

  if (daysError) {
    return {
      success: false,
      error:
        daysError.message || "An error occurred while saving program days.",
    };
  }

  return {
    success: true,
    data,
  };
}

async function insertExercises(
  supabase: SupabaseClient,
  programDays: z.infer<typeof ProgramSchema>["days"],
  daysData: Tables<"program_days">[]
): Promise<{ success: boolean; error?: string }> {
  const exercisesToInsert: TablesInsert<"program_day_exercises">[] = [];
  const dayNumberToIdMap = new Map<number, string>(
    daysData.map((day) => [day.day_number, day.id])
  );
  programDays.forEach((day) => {
    if (day.dayType === DayTypeEnum.enum.exercise) {
      const dayId = dayNumberToIdMap.get(day.dayNumber);
      if (!dayId) return;

      day.exercises.forEach((exercise) => {
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
      return {
        success: false,
        error:
          exercisesError.message ||
          "An error occurred while saving program exercises.",
      };
    }
  }

  return { success: true };
}

async function updateDays(
  supabase: SupabaseClient,
  programDays: z.infer<typeof ProgramSchema>["days"],
  programId: string
): Promise<{
  success: boolean;
  data?: Map<number, string>;
  error?: string;
}> {
  const { data: existingDays, error } = await supabase
    .from("program_days")
    .select("id, day_number")
    .eq("program_id", programId);

  if (error) {
    return {
      success: false,
      error: error.message || "An error occurred while fetching program days.",
    };
  }

  const existingDayIds = existingDays.map((day) => day.id);

  const daysToUpsert = programDays.map((day) => {
    const row: TablesUpdate<"program_days"> = {
      program_id: programId,
      name: day.dayType === DayTypeEnum.enum.exercise ? day.name : "Rest Day",
      day_number: day.dayNumber,
      day_type: day.dayType,
    };
    if (day.id) {
      row["id"] = day.id;
    }
    return row;
  });

  // split insert and update to avoid conflict issues
  const daysToInsert = daysToUpsert.filter((day) => !day.id);
  const daysToUpdate = daysToUpsert.filter((day) => day.id);

  let insertedDays: { id: string; day_number: number }[] = [];
  if (daysToInsert.length > 0) {
    const { data, error: insertDaysError } = await supabase
      .from("program_days")
      .insert(daysToInsert)
      .select("id, day_number");
    if (insertDaysError) {
      return {
        success: false,
        error:
          insertDaysError.message ||
          "An error occurred while inserting program days.",
      };
    }
    insertedDays = data!;
  }

  let updatedDays: { id: string; day_number: number }[] = [];
  if (daysToUpdate.length > 0) {
    const { data, error: updateDaysError } = await supabase
      .from("program_days")
      .upsert(daysToUpdate, { onConflict: "id" })
      .select("id, day_number");
    if (updateDaysError) {
      return {
        success: false,
        error:
          updateDaysError.message ||
          "An error occurred while updating program days.",
      };
    }
    updatedDays = data!;
  }

  // Delete removed days
  const incomingDayIds = new Set(
    programDays.filter((day) => day.id).map((day) => day.id!)
  );
  const dayIdsToDelete = existingDayIds.filter((id) => !incomingDayIds.has(id));

  if (dayIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("program_days")
      .delete()
      .in("id", dayIdsToDelete);
    if (deleteError) {
      return {
        success: false,
        error:
          deleteError.message ||
          "An error occurred while deleting removed program days.",
      };
    }
  }

  // reconstruct upsertedDays
  const allDays = [...insertedDays, ...updatedDays];
  const dayNumberToIdMap = new Map<number, string>(
    allDays.map((day) => [day.day_number, day.id])
  );
  return { success: true, data: dayNumberToIdMap };
}

async function updateExercises(
  supabase: SupabaseClient,
  programDays: z.infer<typeof ProgramSchema>["days"],
  dayNumberToIdMap: Map<number, string>
): Promise<{ success: boolean; error?: string }> {
  const exercisesToUpsert = programDays
    .filter(
      (day): day is ExerciseDay => day.dayType === DayTypeEnum.enum.exercise
    )
    .flatMap((day) =>
      day.exercises.map((ex) => {
        const row: TablesUpdate<"program_day_exercises"> = {
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
      return {
        success: false,
        error:
          insertError.message ||
          "An error occurred while inserting program exercises.",
      };
    }
  }

  if (exercisesToUpdate.length > 0) {
    const { error: updateError } = await supabase
      .from("program_day_exercises")
      .upsert(exercisesToUpdate, { onConflict: "id" });
    if (updateError) {
      return {
        success: false,
        error:
          updateError.message ||
          "An error occurred while updating program exercises.",
      };
    }
  }

  // Delete removed exercises
  const allDayIds = Array.from(dayNumberToIdMap.values());
  const { data: existingExercises } = await supabase
    .from("program_day_exercises")
    .select("id, program_day_id")
    .in("program_day_id", allDayIds);

  const existingExerciseIds = existingExercises?.map((ex) => ex.id) || [];
  const incomingExerciseIds = new Set(
    exercisesToUpsert.filter((ex) => ex.id).map((ex) => ex.id!)
  );
  const exerciseIdsToDelete = existingExerciseIds.filter(
    (id) => !incomingExerciseIds.has(id)
  );

  if (exerciseIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("program_day_exercises")
      .delete()
      .in("id", exerciseIdsToDelete);

    if (deleteError) {
      return {
        success: false,
        error:
          deleteError.message ||
          "An error occurred while deleting removed program exercises.",
      };
    }
  }

  return { success: true };
}

export async function getProgramDraft(programId: string, userId: string) {
  const supabase = await createClient();

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId)
    .eq("user_id", userId)
    .single();

  const { data: programDays } = await supabase
    .from("program_days")
    .select(
      `*, program_day_exercises(
          *, exercises (id, name)
    )`
    )
    .eq("program_id", programId)
    .order("day_number", { ascending: true })
    .order("sort_order", {
      referencedTable: "program_day_exercises",
      ascending: true,
    });
  return normalizeProgram(program, programDays || []);
}

export async function createProgram(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const userId = user?.id;

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
  const daysResult = await insertDays(supabase, program!.days, programId);

  if (!daysResult.success) {
    throw new Error(daysResult.error);
  }
  const daysData = daysResult.data;
   if (!daysData) {
     throw new Error("Program days data is required to insert exercises");
   }

  // Insert exercises for exercise days
  const exercisesResult = await insertExercises(supabase, program!.days, daysData);
  if (!exercisesResult.success) {
    throw new Error(exercisesResult.error);
  }

  revalidatePath("/programs");
  redirect("/programs");
}

export async function editProgram(formData: FormData, programId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const userId = user?.id;

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
      last_modified: new Date(Date.now()).toISOString(),
    })
    .eq("id", programId)
    .eq("user_id", userId);
  if (programError) {
    throw programError;
  }

  // Update program days
  const updateDaysResult = await updateDays(supabase, program.days, programId);
  if (!updateDaysResult.success) {
    throw new Error(updateDaysResult.error);
  }
  const dayNumberToIdMap = updateDaysResult.data;

  // Update program day exercises
  const updateExercisesResult = await updateExercises(
    supabase,
    program.days,
    dayNumberToIdMap!
  );
  if (!updateExercisesResult.success) {
    throw new Error(updateExercisesResult.error);
  }

  revalidatePath("/programs");
  redirect("/programs");
}

export async function deleteProgram(programId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const userId = user?.id;

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId)
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
}
