import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EventItem = {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
};

export function EventList({ events, emptyMessage = "No events found." }: { events: EventItem[]; emptyMessage?: string }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{event.type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p>
            <pre className="overflow-x-auto rounded bg-slate-50 p-2 text-xs">{JSON.stringify(event.payload, null, 2)}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
