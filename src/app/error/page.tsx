export default function Error() {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center text-center overflow-hidden">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-lg text-foreground">
          Uh oh! Something went wrong.
        </p>
      </div>
    );
  }
  