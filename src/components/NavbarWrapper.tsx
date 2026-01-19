import Navbar from "./Navbar";
import { createClient } from "../lib/supabase/server";

export default async function NavbarWrapper() {
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