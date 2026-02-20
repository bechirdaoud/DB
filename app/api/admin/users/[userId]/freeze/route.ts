import { AccountStatus, EventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureActiveAccount, requireApiAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/db/prisma";

const bodySchema = z.object({
  status: z.enum(["ACTIVE", "FROZEN"]).optional(),
});

type Params = {
  params: { userId: string };
};

export async function POST(request: Request, { params }: Params) {
  const result = await requireApiAdmin();
  if ("error" in result) {
    return result.error;
  }

  const frozenResponse = ensureActiveAccount(result.user.account?.status);
  if (frozenResponse) {
    return frozenResponse;
  }

  const { userId } = params;

  const body = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    include: { account: true },
  });

  if (!target) {
    return NextResponse.json({ error: "Target user not found" }, { status: 404 });
  }

  const nextStatus =
    parsed.data.status ??
    (target.account?.status === AccountStatus.FROZEN
      ? AccountStatus.ACTIVE
      : AccountStatus.FROZEN);

  const statusChange = await prisma.$transaction(async (tx) => {
    const account = await tx.account.upsert({
      where: { userId: target.id },
      update: { status: nextStatus },
      create: {
        userId: target.id,
        status: nextStatus,
      },
    });

    const payload = {
      previousStatus: target.account?.status ?? AccountStatus.ACTIVE,
      newStatus: nextStatus,
      changedBy: result.user.id,
    };

    await tx.event.create({
      data: {
        userId: target.id,
        type: EventType.ACCOUNT_STATUS_CHANGED,
        payload,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: result.user.id,
        targetUserId: target.id,
        action: "ACCOUNT_STATUS_CHANGED",
        metadata: payload,
      },
    });

    return account;
  });

  return NextResponse.json({ account: statusChange });
}
