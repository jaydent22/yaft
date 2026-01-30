"use server";
import { createClient } from "../../lib/supabase/server";

export default async function Programs() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("user_id", user?.id);

  return (
    <div className="text-center">
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
      <div className="grid grid-cols-3 gap-4"></div>
    </div>
  );
}
