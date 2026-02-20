"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Banner } from "@/components/Banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventList } from "@/components/EventList";
import { fetchJSON } from "@/lib/http";

type MeResponse = {
  user: {
    account: { status: "ACTIVE" | "FROZEN" } | null;
    preferences: {
      riskLevel: "LOW" | "MEDIUM" | "HIGH";
      strategyId: string;
      constraints: unknown;
    } | null;
  };
};

type EventsResponse = {
  items: Array<{ id: string; type: string; payload: unknown; createdAt: string }>;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse["user"] | null>(null);
  const [events, setEvents] = useState<EventsResponse["items"]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [meRes, eventsRes] = await Promise.all([fetchJSON<MeResponse>("/api/me"), fetchJSON<EventsResponse>("/api/events?limit=5")]);

      if (!meRes.ok) {
        setError(meRes.status === 401 ? "Please sign in" : `${meRes.status}: ${meRes.message}`);
        setLoading(false);
        return;
      }

      if (!eventsRes.ok) {
        setError(eventsRes.status === 401 ? "Please sign in" : `${eventsRes.status}: ${eventsRes.message}`);
        setLoading(false);
        setMe(meRes.data.user);
        return;
      }

      setMe(meRes.data.user);
      setEvents(eventsRes.data.items);
      setError(null);
      setLoading(false);
    };

    void load();
  }, []);

  const preferencesText = useMemo(() => {
    if (!me?.preferences) {
      return "Not set";
    }

    return `${me.preferences.riskLevel} • ${me.preferences.strategyId} • ${JSON.stringify(me.preferences.constraints)}`;
  }, [me]);

  return (
    <AppShell title="Dashboard" description="At-a-glance account insights and secure client summary.">
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <Banner message={error} variant="error" />}
      {me?.account?.status === "FROZEN" && <Banner message="Your account is currently frozen." variant="warning" />}

      {!loading && me && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{me.account?.status ?? "ACTIVE"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Preferences Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{preferencesText}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Last 5 events</h2>
        <EventList events={events} emptyMessage="No recent events." />
      </section>
    </AppShell>
  );
}
