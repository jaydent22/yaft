"use client";

import { Fragment, useState } from "react";
import FloatingInput from "../FloatingInput";
import ExerciseDayCard from "../exercises/ExerciseDayCard";
import RestDayCard from "../exercises/RestDayCard";
import AddDayButton from "./AddDayButton";

export type Exercise = {
  id: string; // temp id
  name: string;
  sets: number;
  reps: number;
  sortOrder: number;
};

type ExerciseDay = {
  id: string; // temp id
  type: "exercise";
  name?: string;
  dayNumber: number;
  exercises: Exercise[];
};

type RestDay = {
  id: string; // temp id
  type: "rest";
  dayNumber: number;
};

export type ProgramDay = ExerciseDay | RestDay;

type ProgramDraft = {
  name: string;
  description: string;
  days: ProgramDay[];
};

const ProgramEditor = () => {
  const [program, setProgram] = useState<ProgramDraft>({
    name: "",
    description: "",
    days: [],
  });

  function addDay(type: "exercise" | "rest", index: number) {
    setProgram((prevProgram) => {
      const newDay: ProgramDay =
        type === "exercise"
          ? {
              id: crypto.randomUUID(),
              type: "exercise",
              name: "",
              dayNumber: 0,
              exercises: [],
            }
          : {
              id: crypto.randomUUID(),
              type: "rest",
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
        day.id === updatedDay.id ? updatedDay : day
      ),
    }));
  }

  function handleDayDelete(dayId: string) {
    setProgram((prevProgram) => {
      const updatedDays = prevProgram.days
        .filter((day) => day.id !== dayId)
        .map((day, i) => ({
          ...day,
          dayNumber: i + 1,
        }));
      return { ...prevProgram, days: updatedDays };
    });
  }

  return (
    <div className="flex flex-col flex-1">
      <form className="flex flex-col flex-1 space-y-6 md:space-y-12">
        <FloatingInput
          id="program-name"
          label="Program Name"
          variant="title"
          value={program.name ?? ""}
          className="max-w-md"
          onChange={(e) => setProgram({ ...program, name: e.target.value })}
          required
        />
        <FloatingInput
          id="program-description"
          label="Program Description"
          value={program.description ?? ""}
          className="max-w-md"
          onChange={(e) =>
            setProgram({ ...program, description: e.target.value })
          }
        />
        <div className="flex flex-1 overflow-y-auto border border-border rounded-lg p-2 md:p-4 items-center justify-center">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center">
            <AddDayButton index={0} onAddDay={addDay} />

            {program.days.map((day, index) => (
              <Fragment key={day.id}>
                {day.type === "exercise" ? (
                  <ExerciseDayCard day={day} onUpdate={handleDayUpdate} onDelete={() => handleDayDelete(day.id)}/>
                ) : (
                  <RestDayCard onDelete={() => handleDayDelete(day.id)} />
                )}
                <AddDayButton index={index + 1} onAddDay={addDay} />
              </Fragment>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-white py-3 rounded-md hover:bg-accent-hover focus:outline-none active:bg-accent-active"
        >
          Save Program
        </button>
      </form>
    </div>
  );
};

export default ProgramEditor;
