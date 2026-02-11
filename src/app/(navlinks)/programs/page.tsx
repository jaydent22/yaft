"use server";
import { createClient } from "../../../lib/supabase/server";
import ProgramList from "../../../components/programs/ProgramList";

export default async function Programs() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("programs")
    .select("*, program_days(name, day_number)")
    .eq("user_id", user?.id);
  data?.sort((a, b) => (a.last_modified! > b.last_modified! ? -1 : 1));

  return <ProgramList initialPrograms={data || []} />;
}
