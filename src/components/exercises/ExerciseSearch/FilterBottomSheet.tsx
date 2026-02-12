import { useState } from "react";
import BottomSheet from "../../BottomSheet";
import type { Tables } from "../../../types/database";
import type { MuscleGroupWithMuscles } from "../../../lib/actions/filters";

const FilterBottomSheet = ({
  muscleGroups,
  equipment,
  selectedMuscleId,
  setSelectedMuscleId,
  selectedGroupId,
  setSelectedGroupId,
  selectedEquipment,
  setSelectedEquipment,
  onApply,
  onClear,
}: {
  muscleGroups: MuscleGroupWithMuscles[];
  equipment: Tables<"equipment">[];
  selectedMuscleId: string;
  setSelectedMuscleId: (id: string) => void;
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  selectedEquipment: string;
  setSelectedEquipment: (id: string) => void;
  onApply: () => void;
  onClear: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedGroup = muscleGroups.find(
    (group) => (group.id == selectedGroupId)
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-border rounded-full background-surface text-foreground active:bg-surface-active"
      >
        <div className="flex space-x-2 items-center">
          <p>Filter</p>
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
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </div>
      </button>
      <BottomSheet isOpen={isOpen} size="auto" onClose={() => setIsOpen(false)}>
        <div className="flex-1 overflow-y-auto space-y-2">
          <h2 className="text-lg font-bold">Filters</h2>
          <div className="flex justify-between items-center">
            <p className="block mt-4 mb-1 font-medium">Muscle Group</p>
            <select
              value={selectedGroupId}
              onChange={(e) => {
                setSelectedGroupId(e.target.value);
                setSelectedMuscleId("");
              }}
              className="border border-border rounded-full p-2 focus:outline-none focus:border-accent"
            >
              <option value="">Select a muscle group</option>
              {muscleGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          {selectedGroup &&
            selectedGroup.muscles.length > 1 && (
              <div className="flex justify-between items-center">
                <p className="block mt-4 mb-1 font-medium">Muscle</p>
                <select
                  value={selectedMuscleId}
                  onChange={(e) => setSelectedMuscleId(e.target.value)}
                  className="border border-border rounded-full p-2 focus-outline-none focus:border-accent"
                >
                  <option value="">All {selectedGroup.name}</option>
                  {selectedGroup.muscles.map((muscle) => (
                    <option key={muscle.id} value={muscle.id}>
                      {muscle.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          <div className="flex justify-between items-center">
            <p className="block mt-4 mb-1 font-medium">Equipment</p>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="border border-border rounded-full p-2 focus:outline-none focus:border-accent"
            >
              <option value="">Select equipment</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* sticky buttons at the bottom */}
        <div className="pt-4 mt-4 border-t border-border">
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="px-2 py-1 rounded-md bg-surface active:bg-surface-active border border-border"
              onClick={() => onClear()}
            >
              Clear
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded-md bg-accent active:bg-accent-active border border-border"
              onClick={() => {
                onApply();
                setIsOpen(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default FilterBottomSheet;
