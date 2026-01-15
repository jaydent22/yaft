export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-surface rounded-lg shadow-md p-8">
        {children}
      </div>
    </div>
  );
}
