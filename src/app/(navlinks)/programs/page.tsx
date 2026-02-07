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

  // function formatDays(day: { name: string; day_number: number }[]) {
  //   let days: any = [];
  //   const sortedDay = day.sort((a, b) => a.day_number - b.day_number);
  //   sortedDay.forEach((d) => {
  //     d.name === "Rest Day" ? days.push("R") : days.push("E");
  //   })
  //   return days.join("-");
  // }

  return <ProgramList initialPrograms={data || []} />;
}
