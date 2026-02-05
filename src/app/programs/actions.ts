import { createClient } from "../../lib/supabase/server";
import type { ProgramDraft } from "../../components/programs/ProgramEditor";

function normalizeProgram(
  program: any,
  programDays: any[],
  programDayExercises: any[]
): ProgramDraft {
  return {
    name: program.name,
    description: program.description,
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
          exercises: programDayExercises
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
    .select("*")
    .eq("program_id", programId)
    .order("day_number", { ascending: true });

  console.log("programDays", programDays);
  const programDayIds = programDays?.map((day) => day.id) || [];

  const { data: programExercises } = await supabase
    .from("program_day_exercises")
    .select("*, exercises (id, name)")
    .in("program_day_id", programDayIds)
    .order("sort_order", { ascending: true });

  return normalizeProgram(program, programDays || [], programExercises || []);
}
