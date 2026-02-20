"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Banner } from "@/components/Banner";
import { LoadingButton } from "@/components/LoadingButton";
import { fetchJSON } from "@/lib/http";

type UserRecord = {
  id: string;
  email: string;
  role: string;
  account: { status: "ACTIVE" | "FROZEN" } | null;
};

type UsersResponse = { users: UserRecord[] };

export default function AdminUserDetailPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const [user, setUser] = useState<UserRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetchJSON<UsersResponse>("/api/admin/users");
      if (!res.ok) {
        setError(res.status === 401 ? "Please sign in" : `${res.status}: ${res.message}`);
        return;
      }

      const selected = res.data.users.find((item) => item.id === userId);
      if (!selected) {
        setError("404: User not found");
        return;
      }

      setUser(selected);
    };

    if (userId) {
      void load();
    }
  }, [userId]);

  const toggleFreeze = async () => {
    if (!user) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    const res = await fetchJSON<{ account: { status: "ACTIVE" | "FROZEN" } }>(`/api/admin/users/${user.id}/freeze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: user.account?.status === "FROZEN" ? "ACTIVE" : "FROZEN" }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError(res.status === 401 ? "Please sign in" : `${res.status}: ${res.message}`);
      return;
    }

    setUser({ ...user, account: { status: res.data.account.status } });
    setMessage(`Account status updated to ${res.data.account.status}.`);
  };

  return (
    <AppShell title={`Admin • User ${userId ?? ""}`} description="User detail and account controls.">
      {error && <Banner message={error} variant="error" />}
      {message && <Banner message={message} variant="success" />}

      {user && (
        <div className="space-y-3 text-sm">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Account Status:</strong> {user.account?.status ?? "ACTIVE"}
          </p>

          <LoadingButton loading={submitting} loadingLabel="Updating..." onClick={() => void toggleFreeze()}>
            {user.account?.status === "FROZEN" ? "Unfreeze" : "Freeze"} account
          </LoadingButton>
        </div>
      )}
    </AppShell>
  );
}
