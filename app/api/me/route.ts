import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const result = await requireApiUser();
  if ("error" in result) {
    return result.error;
  }

  const user = await prisma.user.findUnique({
    where: { id: result.user.id },
    include: {
      account: true,
      preferences: true,
    },
  });

  return NextResponse.json({ user });
}
