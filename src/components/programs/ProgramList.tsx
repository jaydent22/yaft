"use client";

import { useState } from "react";
import AnchoredMenu from "../AnchoredMenu";
import { deleteProgram } from "../../lib/actions/programs";
import type { Tables } from "../../types/database";

export type ProgramWithDays = Tables<"programs"> & {
  program_days: Pick<
    Tables<"program_days">,
    "name" | "day_number" | "day_type"
  >[];
};

const ProgramList = ({
  initialPrograms,
}: {
  initialPrograms: ProgramWithDays[];
}) => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [currentSort, setCurrentSort] = useState<
    "created_at" | "last_modified" | "name"
  >("last_modified");
  const [isDescending, setIsDescending] = useState(true);

  function sortPrograms(criteria: "created_at" | "last_modified" | "name") {
    let sorted: any[] = [];
    if (criteria === currentSort) {
      // If already sorted by this criterion, reverse the order
      sorted = [...programs].reverse();
      setIsDescending(!isDescending);
    } else {
      sorted = [...programs].sort((a, b) => {
        if (criteria === "name") {
          setIsDescending(false);
          return a.name.localeCompare(b.name);
        } else {
          setIsDescending(true);
          return (
            new Date(b[criteria]).getTime() - new Date(a[criteria]).getTime()
          );
        }
      });
    }
    setPrograms(sorted);
    setCurrentSort(criteria);
  }

  function handleProgramDelete(programId: string) {
    setPrograms((prevPrograms) =>
      prevPrograms.filter((program) => program.id !== programId)
    );
    deleteProgram(programId);
  }

  return (
    <div className="text-center space-y-2 md:space-y-4">
      {programs && programs.length == 0 ? (
        <>
          <h1 className="text-4xl font-bold text-accent mb-4">Programs</h1>
          <p className="text-lg text-foreground">
            You have no programs yet. Create a new program to get started!
          </p>
          <a
            href="/programs/new"
            className="mt-6 inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover"
          >
            Create New Program
          </a>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-accent">Programs</h1>
            <div className="flex space-x-2">
              <AnchoredMenu
                button={
                  <div className="flex items-center">
                    <p className="px-2 py-1 text-foreground rounded">Sort By</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                          isDescending
                            ? `M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25`
                            : `M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12`
                        }
                      />
                    </svg>
                  </div>
                }
              >
                {({ closeMenu }) => (
                  <div className="flex flex-col p-4 space-y-2">
                    <button
                      type="button"
                      className={`px-2 py-1 rounded-md text-left ${
                        currentSort === "last_modified"
                          ? "bg-surface-hover"
                          : ""
                      } hover:bg-surface-hover active:bg-surface-active`}
                      onClick={() => {
                        sortPrograms("last_modified");
                        closeMenu();
                      }}
                    >
                      Last Modified
                    </button>
                    <button
                      type="button"
                      className={`px-2 py-1 rounded-md text-left ${
                        currentSort === "created_at" ? "bg-surface-hover" : ""
                      } hover:bg-surface-hover active:bg-surface-active`}
                      onClick={() => {
                        sortPrograms("created_at");
                        closeMenu();
                      }}
                    >
                      Creation Date
                    </button>
                    <button
                      type="button"
                      className={`px-2 py-1 rounded-md text-left ${
                        currentSort === "name" ? "bg-surface-hover" : ""
                      } hover:bg-surface-hover active:bg-surface-active`}
                      onClick={() => {
                        sortPrograms("name");
                        closeMenu();
                      }}
                    >
                      Name
                    </button>
                  </div>
                )}
              </AnchoredMenu>
              <a
                href="/programs/new"
                className="px-2 md:px-4 space-x-2 bg-accent text-white rounded hover:bg-accent-dark flex items-center"
              >
                <p>New</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div className="flex flex-wrap justify-center gap-4"> */}
            {programs &&
              programs.map((program) => (
                // <div
                //   key={program.id}
                //   className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow basis-full md:basis-[calc((100%-3rem)/3)] max-w-full"
                // >
                <div
                  key={program.id}
                  className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col justify-between max-w-full"
                >
                  <div className="relative flex items-center justify-center mb-2">
                    <h2 className="text-2xl font-bold text-foreground pr-10">
                      {program.name}
                    </h2>
                    <div className="absolute right-2">
                      <AnchoredMenu button={<div>···</div>} align="right">
                        {({ closeMenu }) => (
                          <div className="flex flex-col p-4 space-y-2">
                            <a
                              href={`/programs/${program.id}/edit`}
                              className="px-2 py-1 rounded-md text-left hover:bg-surface-hover active:bg-surface-active"
                              onClick={closeMenu}
                            >
                              Edit
                            </a>
                            <button
                              type="button"
                              className="px-2 py-1 rounded-md text-left hover:bg-surface-hover active:bg-surface-active text-red-500"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this program? This action cannot be undone."
                                  )
                                ) {
                                  handleProgramDelete(program.id);
                                  closeMenu();
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </AnchoredMenu>
                    </div>
                  </div>
                  <div className="text-foreground mb-2 md:mb-4">
                    {program.description!.length > 0 ? (
                      <p>{program.description}</p>
                    ) : (
                      <p className="italic">No description provided.</p>
                    )}
                  </div>
                  <div className="flex overflow-x-auto gap-2 mb-2 md:mb-4 py-1 max-h-20 scroll-smooth scrollbar-thin">
                    {program.program_days.map((day, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center px-2 py-1 bg-surface border border-border rounded text-xs text-foreground w-20 shrink-0"
                      >
                        <span>{day.day_type === "exercise" ? "💪" : "💤"}</span>
                        <span className="truncate">{day.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full text-left space-y-1 pt-2">
                    <p className="text-xs italic text-foreground-muted">
                      Created: {new Date(program.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs italic text-foreground-muted">
                      Last Modified:{" "}
                      {new Date(program.last_modified).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={`/programs/${program.id}`}
                    className="mt-4 md:mt-6 inline-block w-full px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover active:bg-accent-active"
                  >
                    View Program
                  </a>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgramList;
