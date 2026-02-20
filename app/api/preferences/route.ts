import { EventType, RiskLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureActiveAccount, requireApiUser } from "@/lib/api/auth";
import { prisma } from "@/lib/db/prisma";

const preferencesSchema = z.object({
  riskLevel: z.nativeEnum(RiskLevel),
  strategyId: z.string().min(1),
  constraints: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  const result = await requireApiUser();
  if ("error" in result) {
    return result.error;
  }

  const frozenResponse = ensureActiveAccount(result.user.account?.status);
  if (frozenResponse) {
    return frozenResponse;
  }

  const body = await request.json().catch(() => null);
  const parsed = preferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const preferences = await tx.preferences.upsert({
      where: { userId: result.user.id },
      update: parsed.data,
      create: {
        userId: result.user.id,
        ...parsed.data,
      },
    });

    const payload = {
      riskLevel: preferences.riskLevel,
      strategyId: preferences.strategyId,
      constraints: preferences.constraints,
    };

    await tx.event.create({
      data: {
        userId: result.user.id,
        type: EventType.PREFERENCES_UPDATED,
        payload,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: result.user.id,
        targetUserId: result.user.id,
        action: "PREFERENCES_UPDATED",
        metadata: payload,
      },
    });

    return preferences;
  });

  return NextResponse.json({ preferences: updated });
}
