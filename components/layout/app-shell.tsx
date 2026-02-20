import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { navItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 p-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border bg-white p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Secure Portal
          </div>
          <nav className="space-y-4">
            {(["Portal", "Admin"] as const).map((group) => (
              <div key={group}>
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{group}</p>
                <ul className="space-y-1">
                  {navItems
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <li key={item.href}>
                        <Link className={cn("block rounded-md px-2 py-1.5 text-sm hover:bg-slate-100")} href={item.href}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <main className="space-y-6 rounded-xl border bg-white p-6">
          <header>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
