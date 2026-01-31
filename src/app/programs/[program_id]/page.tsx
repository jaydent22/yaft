"use server";

import ProgramEditor from "../../../components/programs/ProgramEditor";
import { createClient } from "../../../lib/supabase/server";
import { getProgramDraft } from "../../programs/actions";

export default async function EditProgramPage({
  params,
}: {
  params: { program_id: string };
}) {
  // params is a Promise
  const slug = await params;
  console.log("EditProgramPage params:", slug);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const programId = slug.program_id;
  console.log(programId, "user id:", user?.id);

  const programDraft = await getProgramDraft(programId, user!.id);
  console.log("Program draft for editing:", programDraft);

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-4xl font-bold text-accent mb-4 text-center">
        Edit Program
      </h1>
      <ProgramEditor programInfo={programDraft} />
    </div>
  );
}
