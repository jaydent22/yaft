"use client";

import { useState } from "react";
import FloatingInput from "../FloatingInput";

const ProgramEditor = () => {
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  return (
    <div>
      <form className="space-y-6 md:space-y-12">
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
        <div>
            placeholder
        </div>
      </form>
    </div>
  );
};

export default ProgramEditor;
