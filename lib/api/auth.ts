import { auth } from "@clerk/nextjs/server";
import { AccountStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export async function requireApiUser() {
  const { userId } = await auth();

  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { account: true },
  });

  if (!user) {
    return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
  }

  return { user };
}

export async function requireApiAdmin() {
  const result = await requireApiUser();
  if ("error" in result) {
    return result;
  }

  if (result.user.role !== Role.ADMIN) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return result;
}

export function ensureActiveAccount(status: AccountStatus | undefined | null) {
  if (status === AccountStatus.FROZEN) {
    return NextResponse.json({ error: "Account is frozen" }, { status: 403 });
  }

  return null;
}
