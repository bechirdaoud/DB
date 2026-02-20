import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/db/prisma";

const querySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export async function GET(request: Request) {
  const result = await requireApiAdmin();
  if ("error" in result) {
    return result.error;
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { cursor, limit } = parsed.data;

  const logs = await prisma.auditLog.findMany({
    include: {
      actorUser: true,
      targetUser: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
  });

  const hasMore = logs.length > limit;
  const items = hasMore ? logs.slice(0, limit) : logs;
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

  return NextResponse.json({ items, nextCursor });
}
