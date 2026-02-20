"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Banner } from "@/components/Banner";
import { LoadingButton } from "@/components/LoadingButton";
import { EventList } from "@/components/EventList";
import { fetchJSON } from "@/lib/http";

type EventsResponse = {
  items: Array<{ id: string; type: string; payload: unknown; createdAt: string }>;
  nextCursor: string | null;
};

export default function ActivityPage() {
  const [events, setEvents] = useState<EventsResponse["items"]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("ALL");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadEvents = useCallback(async (cursor?: string) => {
    setLoading(true);
    const suffix = cursor ? `&cursor=${encodeURIComponent(cursor)}` : "";
    const res = await fetchJSON<EventsResponse>(`/api/events?limit=20${suffix}`);
    setLoading(false);

    if (!res.ok) {
      setError(res.status === 401 ? "Please sign in" : `${res.status}: ${res.message}`);
      return;
    }

    setError(null);
    setNextCursor(res.data.nextCursor);
    setEvents((previous) => (cursor ? [...previous, ...res.data.items] : res.data.items));
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const typeOptions = useMemo(() => {
    const unique = new Set(events.map((event) => event.type));
    return ["ALL", ...Array.from(unique)];
  }, [events]);

  const filteredEvents = useMemo(
    () => events.filter((event) => selectedType === "ALL" || event.type === selectedType),
    [events, selectedType],
  );

  return (
    <AppShell title="Activity" description="Track recent account events and user actions.">
      {error && <Banner message={error} variant="error" />}
      <div className="flex items-center gap-2">
        <label className="text-sm">Filter by type</label>
        <select className="rounded-md border px-3 py-2 text-sm" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <EventList events={filteredEvents} emptyMessage="No activity yet." />

      {nextCursor && (
        <LoadingButton loading={loading} loadingLabel="Loading..." onClick={() => void loadEvents(nextCursor)}>
          Load more
        </LoadingButton>
      )}
    </AppShell>
  );
}
