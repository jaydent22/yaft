import Navbar from "./Navbar";
import { createClient } from "../lib/supabase/server";
import { unstable_noStore } from "next/cache";

export default async function NavbarWrapper() {
    // Do not cache this component
    unstable_noStore();

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();


  if (!user) {
    return <Navbar user={null} profile={null} />;
  }

    const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "email, first_name, last_name, display_name"
    )
    .eq("id", user.id)
    .single();

    return <Navbar user={user} profile={profile} />;
}