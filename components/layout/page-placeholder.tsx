import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AppShell } from "@/components/layout/app-shell";

export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <AppShell title={title} description={description}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Placeholder content for future implementation.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Add secure workflows, API integrations, and access controls here.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Suggested next steps.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              <li>Connect authenticated user context.</li>
              <li>Wire up backend data sources.</li>
              <li>Implement role-based permissions.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Empty state for timeline/table components.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">No records yet.</CardContent>
      </Card>
    </AppShell>
  );
}
