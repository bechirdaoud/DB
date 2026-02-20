"use client";

import { FormEvent, useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Banner } from "@/components/Banner";
import { LoadingButton } from "@/components/LoadingButton";
import { fetchJSON } from "@/lib/http";

type MeResponse = {
  user: {
    account: { status: "ACTIVE" | "FROZEN" } | null;
    preferences: {
      riskLevel: "LOW" | "MEDIUM" | "HIGH";
      strategyId: string;
      constraints: Record<string, unknown>;
    } | null;
  };
};

const strategyOptions = ["balanced-v1", "income-v1", "growth-v2"];

export default function PreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"ACTIVE" | "FROZEN">("ACTIVE");
  const [riskLevel, setRiskLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [strategyId, setStrategyId] = useState(strategyOptions[0]);
  const [constraints, setConstraints] = useState("{}");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const meRes = await fetchJSON<MeResponse>("/api/me");
      if (!meRes.ok) {
        setError(meRes.status === 401 ? "Please sign in" : `${meRes.status}: ${meRes.message}`);
        setLoading(false);
        return;
      }

      const me = meRes.data.user;
      if (me.account?.status) {
        setStatus(me.account.status);
      }
      if (me.preferences) {
        setRiskLevel(me.preferences.riskLevel);
        setStrategyId(me.preferences.strategyId);
        setConstraints(JSON.stringify(me.preferences.constraints ?? {}, null, 2));
      }
      setLoading(false);
    };

    void load();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    let parsedConstraints: Record<string, unknown>;
    try {
      parsedConstraints = JSON.parse(constraints);
    } catch {
      setError("Constraints must be valid JSON.");
      return;
    }

    setSaving(true);
    const res = await fetchJSON<{ preferences: unknown }>("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ riskLevel, strategyId, constraints: parsedConstraints }),
    });
    setSaving(false);

    if (!res.ok) {
      setError(res.status === 401 ? "Please sign in" : `${res.status}: ${res.message}`);
      return;
    }

    setMessage("Preferences saved successfully.");
  };

  const disabled = status === "FROZEN";

  return (
    <AppShell title="Preferences" description="Manage notification, profile, and portal settings.">
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <Banner message={error} variant="error" />}
      {message && <Banner message={message} variant="success" />}
      {disabled && <Banner message="Your account is frozen. Preferences cannot be changed." variant="warning" />}

      {!loading && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1 text-sm">
            <span>Risk level</span>
            <select className="w-full rounded-md border px-3 py-2" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as "LOW" | "MEDIUM" | "HIGH")} disabled={disabled}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>

          <label className="block space-y-1 text-sm">
            <span>Strategy</span>
            <select className="w-full rounded-md border px-3 py-2" value={strategyId} onChange={(e) => setStrategyId(e.target.value)} disabled={disabled}>
              {strategyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1 text-sm">
            <span>Constraints JSON</span>
            <textarea className="min-h-40 w-full rounded-md border px-3 py-2 font-mono text-xs" value={constraints} onChange={(e) => setConstraints(e.target.value)} disabled={disabled} />
          </label>

          <LoadingButton type="submit" loading={saving} loadingLabel="Saving..." disabled={disabled}>
            Save preferences
          </LoadingButton>
        </form>
      )}
    </AppShell>
  );
}
