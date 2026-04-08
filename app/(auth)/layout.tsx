export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
