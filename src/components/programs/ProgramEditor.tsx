"use client";

import { Fragment, useState } from "react";
import FloatingInput from "../FloatingInput";
import ExerciseDayCard from "../exercises/ExerciseDayCard";
import RestDayCard from "../exercises/RestDayCard";
import AddDayButton from "./AddDayButton";
import { DayType, DayTypeEnum } from "../../lib/enums";
import { createProgram, editProgram } from "../../lib/actions/programs";
import type { Tables } from "../../types/database";
import type { MuscleGroupWithMuscles } from "../../lib/actions/filters";

export type Exercise = {
  clientId: string; // temp id for client-side only
  id?: string; // DB id from program_day_exercises table
  exerciseId: string; // DB id from exercises table
  name: string;
  sets: number;
  reps: number;
  sortOrder: number;
};

type BaseDay = {
  clientId: string; // temp id for client-side only
  dayNumber: number;
};

export type ExerciseDay = BaseDay & {
  id?: string; // DB id
  dayType: "exercise";
  name?: string;
  exercises: Exercise[];
};

export type RestDay = BaseDay & {
  id?: string; // DB id
  dayType: "rest";
};

type ProgramDay = ExerciseDay | RestDay;

export type ProgramDraft = {
  name: string;
  description: string;
  days: ProgramDay[];
};

const ProgramEditor = ({
  muscleGroups,
  equipment,
  programInfo,
  programId,
}: {
  muscleGroups: MuscleGroupWithMuscles[];
  equipment: Tables<"equipment">[];
  programInfo?: ProgramDraft;
  programId?: string;
}) => {
  const [program, setProgram] = useState<ProgramDraft>(
    programInfo ?? {
      name: "",
      description: "",
      days: [],
    }
  );
  const [saving, setSaving] = useState(false);

  function addDay(type: DayType, index: number) {
    setProgram((prevProgram) => {
      const newDay: ProgramDay =
        type === "exercise"
          ? {
              clientId: crypto.randomUUID(),
              dayType: "exercise",
              name: undefined,
              dayNumber: 0,
              exercises: [],
            }
          : {
              clientId: crypto.randomUUID(),
              dayType: "rest",
              dayNumber: 0,
            };

      const updatedDays = [
        ...prevProgram.days.slice(0, index),
        newDay,
        ...prevProgram.days.slice(index),
      ].map((day, i) => ({
        ...day,
        dayNumber: i + 1,
      }));

      return { ...prevProgram, days: updatedDays };
    });
  }

  function handleDayUpdate(updatedDay: ProgramDay) {
    setProgram((prevProgram) => ({
      ...prevProgram,
      days: prevProgram.days.map((day) =>
        day.clientId === updatedDay.clientId ? updatedDay : day
      ),
    }));
  }

  function handleDayDelete(dayId: string) {
    setProgram((prevProgram) => {
      const updatedDays = prevProgram.days
        .filter((day) => day.clientId !== dayId)
        .map((day, i) => ({
          ...day,
          dayNumber: i + 1,
        }));
      return { ...prevProgram, days: updatedDays };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setSaving(true);
    e.preventDefault();

    const formData = new FormData();
    formData.set("program", JSON.stringify(program));

    programInfo && programId
      ? await editProgram(formData, programId)
      : await createProgram(formData);
    setSaving(false);
  }

  return (
    <div className="flex flex-col flex-1">
      <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
        <div className="mb-4 md:mb-8 space-y-4">
          <FloatingInput
            id="program-name"
            label="Program Name"
            variant="title"
            value={program.name ?? ""}
            className="max-w-md"
            onChange={(e) => setProgram({ ...program, name: e.target.value })}
            required
          />
          <div className="flex flex-col max-w-2xl">
            <label
              htmlFor="program-description"
              className="text-foreground-muted mb-2 md:mb-4"
            >
              Program Description
            </label>
            <textarea
              id="program-description"
              className="border border-border overflow-y-auto resize-none rounded-md p-3 text-foreground focus:outline-none focus:border-accent h-24"
              value={program.description ?? ""}
              onChange={(e) =>
                setProgram({ ...program, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-y-auto border border-border rounded-lg p-2 md:p-4 mb-2 md:mb-4 items-center justify-center">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center">
            <AddDayButton index={0} onAddDay={addDay} />

            {program.days.map((day, index) => {
              if (day.dayType === DayTypeEnum.enum.exercise) {
                const defaultName = `Exercise Day ${
                  program.days
                    .slice(0, index)
                    .filter((d) => d.dayType === DayTypeEnum.enum.exercise).length + 1
                }`;

                return (
                  <Fragment key={day.clientId}>
                    <ExerciseDayCard
                      day={{ ...day, name: day.name ?? defaultName }}
                      onUpdate={handleDayUpdate}
                      onDelete={() => handleDayDelete(day.clientId)}
                      muscleGroups={muscleGroups}
                      equipment={equipment}
                    />
                    <AddDayButton index={index + 1} onAddDay={addDay} />
                  </Fragment>
                );
              } else {
                return (
                  <Fragment key={day.clientId}>
                    <RestDayCard
                      onDelete={() => handleDayDelete(day.clientId)}
                    />
                    <AddDayButton index={index + 1} onAddDay={addDay} />
                  </Fragment>
                );
              }
            })}
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent text-white py-3 rounded-md hover:bg-accent-hover focus:outline-none active:bg-accent-active disabled:bg-accent-hover"
        >
          {saving ? "Saving..." : "Save Program"}
        </button>
      </form>
    </div>
  );
};

export default ProgramEditor;
