import ProgramEditor from "../../../components/programs/ProgramEditor";

export default function NewProgramPage() {
  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-4xl font-bold text-accent mb-4 text-center">
        Create New Program
      </h1>
      <ProgramEditor />
    </div>
  );
}
