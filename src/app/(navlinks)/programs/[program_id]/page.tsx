"use server";

import ProgramEditor from "../../../../components/programs/ProgramEditor";
import { createClient } from "../../../../lib/supabase/server";
import { getProgramDraft } from "../../../../lib/actions/programs";
import { getMuscleGroups, getEquipment } from "../../../../lib/actions/filters";

export default async function EditProgramPage({
  params,
}: {
  params: { program_id: string };
}) {
  // params is a Promise
  const slug = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const programId = slug.program_id;

  const programDraft = await getProgramDraft(programId, user!.id);

  const muscleGroups = await getMuscleGroups();
  const equipment = await getEquipment();

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-4xl font-bold text-accent mb-4 text-center">
        Edit Program
      </h1>
      <ProgramEditor
        muscleGroups={muscleGroups}
        equipment={equipment}
        programInfo={programDraft}
        programId={programId}
      />
    </div>
  );
}
