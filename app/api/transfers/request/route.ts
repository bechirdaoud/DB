import { EventType, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureActiveAccount, requireApiUser } from "@/lib/api/auth";
import { prisma } from "@/lib/db/prisma";

const transferSchema = z.object({
  type: z.enum(["TOPUP_REQUESTED", "WITHDRAWAL_REQUESTED"]),
  amount: z.number().positive(),
  currency: z.string().min(3).max(8).transform((value) => value.toUpperCase()),
  reference: z.string().min(1).max(200).optional(),
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
  const parsed = transferSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const createdEvent = await prisma.$transaction(async (tx) => {
    const transferPayload: Prisma.InputJsonObject = {
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      reference: parsed.data.reference ?? null,
    };

    const event = await tx.event.create({
      data: {
        userId: result.user.id,
        type: EventType[parsed.data.type],
        payload: transferPayload,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: result.user.id,
        targetUserId: result.user.id,
        action: parsed.data.type,
        metadata: transferPayload,
      },
    });

    return event;
  });

  return NextResponse.json({ event: createdEvent }, { status: 201 });
}
