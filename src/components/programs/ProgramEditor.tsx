"use client";

import { useState } from "react";
import FloatingInput from "../FloatingInput";

type ProgramDraft = {
  name: string;
  description: string;
  days: {
      name: string;
      dayNumber: number;
      exercises: {
          name: string;
          sets: number;
          reps: number;
          sortOrder: number;
      }[];
  }[];
}

const ProgramEditor = () => {
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  return (
    <div className="flex flex-col flex-1">
      <form className="flex flex-col flex-1 space-y-6 md:space-y-12">
        <FloatingInput
          id="program-name"
          label="Program Name"
          variant="title"
          value={programName ?? ""}
          className="max-w-md"
          onChange={(e) => setProgramName(e.target.value)}
          required
        />
        <FloatingInput
          id="program-description"
          label="Program Description"
          value={programDescription ?? ""}
          className="max-w-md"
          onChange={(e) => setProgramDescription(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto border border-border rounded-lg p-2 md:p-4">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            <p>placeholder</p>
            <p>placeholder</p>
            </div>
        </div>
      </form>
    </div>
  );
};

export default ProgramEditor;
