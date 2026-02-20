"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Banner } from "@/components/Banner";
import { fetchJSON } from "@/lib/http";

type UsersResponse = {
  users: Array<{
    id: string;
    email: string;
    role: string;
    createdAt?: string;
    account: { status: string } | null;
  }>;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UsersResponse["users"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchJSON<UsersResponse>("/api/admin/users");
      if (!res.ok) {
        setError(res.status === 401 ? "Please sign in" : `${res.status}: ${res.message}`);
        return;
      }
      setUsers(res.data.users);
    };

    void load();
  }, []);

  return (
    <AppShell title="Admin • Users" description="Directory and lifecycle controls for portal users.">
      {error && <Banner message={error} variant="error" />}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Role</th>
              <th className="px-2 py-2">Account Status</th>
              <th className="px-2 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-2 py-2">
                  <Link className="text-blue-600 underline" href={`/admin/users/${user.id}`}>
                    {user.email}
                  </Link>
                </td>
                <td className="px-2 py-2">{user.role}</td>
                <td className="px-2 py-2">{user.account?.status ?? "ACTIVE"}</td>
                <td className="px-2 py-2">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
