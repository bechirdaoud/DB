import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl space-y-4 rounded-xl border bg-white p-8 text-center">
        <h1 className="text-3xl font-semibold">Secure Client Portal</h1>
        <p className="text-muted-foreground">Next.js + TypeScript + Tailwind + shadcn/ui starter with portal and admin routes.</p>
        <div className="flex justify-center gap-3">
          <Link href="/app/dashboard">
            <Button>Open Dashboard</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline">Open Admin</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
