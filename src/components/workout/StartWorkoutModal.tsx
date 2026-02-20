"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Modal from "../Modal";

import type { Tables } from "../../types/database";

const StartWorkoutModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<Tables<"programs">[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "programs">("select");
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setStep("select");
      setPrograms([]);
    }
  }, [isOpen]);

  const getPrograms = async () => {
    setStep("programs");
    setLoading(true);

    const { data } = await supabase
      .from("programs")
      .select("*")
      .eq("user_id", userId)
      .order("last_modified", { ascending: false });

    setPrograms(data || []);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollable>
      {step === "select" ? (
        <div className="flex w-full h-full items-center justify-center">
          <div className="bg-surface p-6 w-full max-w-md text-center border-r border-border">
            <h2 className="text-2xl font-bold mb-2">From Program</h2>
            <h3 className="text-foreground-muted italic mb-4">
              Start from template
            </h3>
            <button
              onClick={getPrograms}
              className="px-4 py-2 bg-accent text-foreground rounded-full hover:bg-accent-hover active:bg-accent-active"
            >
              Select
            </button>
          </div>
          <div className="bg-surface p-6 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Quick Start</h2>
            <h3 className="text-foreground-muted italic mb-4">Empty program</h3>
            <p className="mb-6">This feature is coming soon. Stay tuned!</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent text-foreground rounded-full hover:bg-accent-hover active:bg-accent-active"
            >
              Select
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="text-left mb-2">
            <button
              role="button"
              onClick={() => setStep("select")}
              className="p-1 text-foreground hover:underline"
            >
              ← Back
            </button>
          </div>

          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {programs.length > 0 &&
                  programs.map((program) => (
                    <div
                      key={program.id}
                      className="border border-border rounded-lg p-2 hover:shadow-lg transition-shadow basis-full md:basis-[calc((100%-3rem)/3)]"
                    >
                      <div className="relative flex items-center justify-center mb-2">
                        <h2 className="text-xl font-bold text-foreground">
                          {program.name}
                        </h2>
                      </div>
                      <div className="text-foreground">
                        {program!.description!.length > 0 ? (
                          <p>{program.description}</p>
                        ) : (
                          <p className="italic">No description provided.</p>
                        )}
                      </div>
                      <button
                        role="button"
                        className="mt-2 md:mt-4 inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover active:bg-accent-active"
                      >
                        Select Program
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StartWorkoutModal;
