"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const {data, error} = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    })
    
    if (error) {
        redirect("/error");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", data.user?.id)
        .single();

    revalidatePath("/", "layout");
    
    if (profileError || !profile?.onboarded) {
        redirect("/profile");
    }

    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    }

    if (!data.email || !data.password || !data.confirmPassword) {
        // return { error: "All fields are required" };
        redirect(`/error?${encodeURIComponent("All fields are required")}`);
    }

    if (data.password !== data.confirmPassword) {
        // return { error: "Passwords do not match" };
        redirect(`/error?${encodeURIComponent("Passwords do not match")}`);
    }

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        // return { error: error.message };
        redirect(`/error?${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/", "layout");
    redirect("/profile");
}