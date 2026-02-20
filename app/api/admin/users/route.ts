import { NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const result = await requireApiAdmin();
  if ("error" in result) {
    return result.error;
  }

  const users = await prisma.user.findMany({
    include: {
      account: true,
      preferences: true,
    },
    orderBy: { email: "asc" },
  });

  return NextResponse.json({ users });
}
