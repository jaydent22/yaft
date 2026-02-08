export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return <div className="flex flex-col flex-1 min-h-0">{children}</div>;
}
