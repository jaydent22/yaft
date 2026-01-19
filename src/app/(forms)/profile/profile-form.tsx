"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import { type User } from "@supabase/supabase-js";

import FloatingInput from "../../../components/FloatingInput";

export default function ProfileForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [onboarded, setOnboarded] = useState<boolean>(false);

  const isNewUser = !onboarded;
  const router = useRouter();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          "email, first_name, last_name, display_name, height_cm, weight_kg, onboarded"
        )
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setDisplayName(data.display_name);
        setHeightCm(data.height_cm);
        setWeightKg(data.weight_kg);
        setOnboarded(data.onboarded);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    firstName,
    lastName,
    displayName,
    heightCm,
    weightKg,
    onboarded,
  }: {
    firstName: string | null;
    lastName: string | null;
    displayName?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    onboarded?: boolean;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        email: user?.email as string,
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        height_cm: heightCm,
        weight_kg: weightKg,
        onboarded: true,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      if (isNewUser) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Profile updated successfully!");
        router.refresh();
      }
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl mb-6 text-center">
        {isNewUser ? "Complete your profile" : "Account Settings"}
      </h1>
      <form
        className="space-y-6 md:space-y-12"
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile({
            firstName,
            lastName,
            displayName,
            heightCm,
            weightKg,
          });
        }}
      >
        <FloatingInput
          id="account-email"
          label="Email"
          value={user?.email}
          disabled
        />
        <FloatingInput
          id="account-first-name"
          label="First Name"
          value={firstName ?? ""}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <FloatingInput
          id="account-last-name"
          label="Last Name"
          value={lastName ?? ""}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <FloatingInput
          id="account-display-name"
          label="Display Name"
          value={displayName || ""}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <FloatingInput
          id="account-height-cm"
          label="Height (cm)"
          type="number"
          value={heightCm !== null ? String(heightCm) : ""}
          onChange={(e) =>
            setHeightCm(e.target.value ? parseInt(e.target.value) : null)
          }
        />
        <FloatingInput
          id="account-weight-kg"
          label="Weight (kg)"
          type="number"
          value={weightKg !== null ? String(weightKg) : ""}
          onChange={(e) =>
            setWeightKg(e.target.value ? parseInt(e.target.value) : null)
          }
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-3 rounded-md hover:bg-accent-hover focus:outline-none active:bg-accent-active"
        >
          {loading ? "Loading ..." : isNewUser ? "Complete Profile" : "Update"}
        </button>
      </form>
    </>
  );
}
