"use server";

import ProgramEditor from "../../../../components/programs/ProgramEditor";
import { createClient } from "../../../../lib/supabase/server";
import { getProgramDraft } from "../../../../lib/actions/programs";

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

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-4xl font-bold text-accent mb-4 text-center">
        Edit Program
      </h1>
      <ProgramEditor programInfo={programDraft} programId={programId} />
    </div>
  );
}
