import { requireAuth } from "@/lib/auth/guards";
import { AppNav } from "@/components/nav/AppNav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="flex min-h-full flex-col">
      <AppNav userEmail={session.user.email ?? ""} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
