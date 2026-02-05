"use server";
import { createClient } from "../../../lib/supabase/server";

export default async function Programs() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("programs")
    .select("*, program_days(name, day_number)")
    .eq("user_id", user?.id);
  data?.sort((a, b) => (a.created_at! > b.created_at! ? 1 : -1));
  console.log(data);

  function formatDays(day: { name: string; day_number: number }[]) {
    let days: any = [];
    const sortedDay = day.sort((a, b) => a.day_number - b.day_number);
    sortedDay.forEach((d) => {
      d.name === "Rest Day" ? days.push("R") : days.push("E");
    })
    return days.join("-");
  }

  return (
    <div className="text-center space-y-2 md:space-y-4">
      <h1 className="text-4xl font-bold text-accent mb-4">Programs</h1>

      {data && data.length == 0 && (
        <p className="text-lg text-foreground">
          You have no programs yet. Create a new program to get started!
        </p>
      )}
      <a
        href="/programs/new"
        className="mt-6 inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark"
      >
        Create New Program
      </a>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data &&
          data.map((program) => (
            <div
              key={program.id}
              className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {program.name}
              </h2>
              <p className="text-foreground mb-4">
                {program.description}
              </p>
              <p className="text-foreground font-medium">
                {formatDays(program.program_days)}
              </p>
              <a
                href={`/programs/${program.id}`}
                className="mt-6 inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark"
                >
                View Program
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}
