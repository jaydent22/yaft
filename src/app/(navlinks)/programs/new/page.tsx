import ProgramEditor from "../../../../components/programs/ProgramEditor";
import { getMuscleGroups, getEquipment } from "../../../../lib/actions/filters";

export default async function NewProgramPage() {
  const muscleGroups = await getMuscleGroups();
  const equipment = await getEquipment();
  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-4xl font-bold text-accent mb-4 text-center">
        Create New Program
      </h1>
      <ProgramEditor muscleGroups={muscleGroups} equipment={equipment} />
    </div>
  );
}
