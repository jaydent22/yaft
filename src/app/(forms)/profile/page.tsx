import ProfileForm from "./profile-form";
import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Profile() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If no user, redirect to login
    if (!user) {
        redirect("/auth/login");
    }

    return <ProfileForm user={user} />;
}