"use client";

import { useCallback, useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Banner } from "@/components/Banner";
import { LoadingButton } from "@/components/LoadingButton";
import { fetchJSON } from "@/lib/http";

type AuditResponse = {
  items: Array<{
    id: string;
    createdAt: string;
    actorUserId: string;
    targetUserId: string | null;
    action: string;
    metadata: unknown;
  }>;
  nextCursor: string | null;
};

export default function AdminAuditPage() {
  const [items, setItems] = useState<AuditResponse["items"]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAudit = useCallback(async (cursor?: string) => {
    setLoading(true);
    const cursorPart = cursor ? `&cursor=${encodeURIComponent(cursor)}` : "";
    const res = await fetchJSON<AuditResponse>(`/api/admin/audit?limit=50${cursorPart}`);
    setLoading(false);

    if (!res.ok) {
      setError(res.status === 401 ? "Please sign in" : `${res.status}: ${res.message}`);
      return;
    }

    setError(null);
    setNextCursor(res.data.nextCursor);
    setItems((previous) => (cursor ? [...previous, ...res.data.items] : res.data.items));
  }, []);

  useEffect(() => {
    void loadAudit();
  }, [loadAudit]);

  return (
    <AppShell title="Admin • Audit" description="Review compliance events and platform audit logs.">
      {error && <Banner message={error} variant="error" />}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-2 py-2">Created At</th>
              <th className="px-2 py-2">Actor</th>
              <th className="px-2 py-2">Target</th>
              <th className="px-2 py-2">Action</th>
              <th className="px-2 py-2">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b align-top">
                <td className="px-2 py-2">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="px-2 py-2">{item.actorUserId}</td>
                <td className="px-2 py-2">{item.targetUserId ?? "-"}</td>
                <td className="px-2 py-2">{item.action}</td>
                <td className="px-2 py-2">
                  <pre className="max-w-xs overflow-x-auto rounded bg-slate-50 p-2 text-xs">{JSON.stringify(item.metadata, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nextCursor && (
        <LoadingButton loading={loading} loadingLabel="Loading..." onClick={() => void loadAudit(nextCursor)}>
          Load more
        </LoadingButton>
      )}
    </AppShell>
  );
}
