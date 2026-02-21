"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Modal from "../Modal";
import type { ProgramWithDays } from "../programs/ProgramList";

const StartWorkoutModal = ({
  isOpen,
  onClose,
  onSelectProgram,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram: (program: ProgramWithDays) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<ProgramWithDays[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "programs" | "days">("select");

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
      .select("*, program_days(name, day_number, day_type)")
      .eq("user_id", userId)
      .order("last_modified", { ascending: false })
      .order("day_number", {
        referencedTable: "program_days",
        ascending: true,
      });

    setPrograms(data || []);
    setLoading(false);
  };

  const getProgramDays = async (programId: number) => {
    setStep("days");
    setLoading(true);

    const { data } = await supabase.from("program_days").select(
      `*, program_day_exercises(
          *, exercises (id, name)
      )`
    )
    .eq("program_id", programId)
    .order("day_number", { ascending: true })
    .order("sort_order", {
      referencedTable: "program_day_exercises",
      ascending: true,
    });
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {programs.length > 0 &&
                  programs.map((program) => (
                    <div
                      key={program.id}
                      className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col justify-between max-w-full"
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
                      <div className="flex overflow-x-auto gap-2 mb-2 md:mb-4 py-1 max-h-20 scroll-smooth scrollbar-thin">
                        {program.program_days.map((day, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center justify-center px-2 py-1 bg-surface border border-border rounded text-xs text-foreground w-24 shrink-0"
                          >
                            <span>
                              {day.day_type === "exercise" ? "💪" : "💤"}
                            </span>
                            <span className="truncate">{day.name}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        role="button"
                        onClick={() => {
                          onSelectProgram(program);
                          onClose();
                        }}
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
