"use client";

import { FormEvent, useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Banner } from "@/components/Banner";
import { LoadingButton } from "@/components/LoadingButton";
import { fetchJSON } from "@/lib/http";

type MeResponse = {
  user: {
    account: { status: "ACTIVE" | "FROZEN" } | null;
  };
};

export default function TransferPage() {
  const [type, setType] = useState<"topup" | "withdraw">("topup");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState<"ACTIVE" | "FROZEN">("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

      if (meRes.data.user.account?.status) {
        setStatus(meRes.data.user.account.status);
      }

      setLoading(false);
    };

    void load();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    setSubmitting(true);
    const res = await fetchJSON<{ event: unknown }>("/api/transfers/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: type === "topup" ? "TOPUP_REQUESTED" : "WITHDRAWAL_REQUESTED",
        amount,
        currency: "USD",
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      setError(res.status === 401 ? "Please sign in" : `${res.status}: ${res.message}`);
      return;
    }

    setMessage("Transfer request submitted.");
  };

  const disabled = status === "FROZEN";

  return (
    <AppShell title="Transfer" description="Initiate secure transfers with verification controls.">
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <Banner message={error} variant="error" />}
      {message && <Banner message={message} variant="success" />}
      {disabled && <Banner message="Your account is frozen. Transfers are disabled." variant="warning" />}

      {!loading && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1 text-sm">
            <span>Type</span>
            <select className="w-full rounded-md border px-3 py-2" value={type} onChange={(e) => setType(e.target.value as "topup" | "withdraw")} disabled={disabled}>
              <option value="topup">topup</option>
              <option value="withdraw">withdraw</option>
            </select>
          </label>

          <label className="block space-y-1 text-sm">
            <span>Amount</span>
            <input className="w-full rounded-md border px-3 py-2" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} disabled={disabled} />
          </label>

          <LoadingButton type="submit" loading={submitting} loadingLabel="Submitting..." disabled={disabled}>
            Submit request
          </LoadingButton>
        </form>
      )}
    </AppShell>
  );
}
