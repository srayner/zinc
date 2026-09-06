"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/ModeToggle";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/zones", label: "Zones" },
  { href: "/backlog", label: "Backlog" },
];

export function AppNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-4 px-4 py-3">
        <Link href="/dashboard" className="font-semibold">
          Zinc
        </Link>
        <nav className="flex flex-1 items-center gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                pathname.startsWith(link.href)
                  ? "bg-accent font-medium"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {userEmail}
        </span>
        <ModeToggle />
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
