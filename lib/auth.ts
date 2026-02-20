import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { hasAdminRole, hasSecondFactor } from "./auth-claims";

export async function requireUser(options?: { requireMfa?: boolean }) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (options?.requireMfa && !hasSecondFactor(sessionClaims)) {
    redirect("/verify-mfa");
  }

  return { userId, sessionClaims };
}

export async function requireAdmin() {
  const { userId, sessionClaims } = await requireUser({ requireMfa: true });

  if (!hasAdminRole(sessionClaims)) {
    redirect("/unauthorized");
  }

  return { userId, sessionClaims };
}
