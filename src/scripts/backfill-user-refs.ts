import { prisma } from "@/lib/prisma";

const BATCH_SIZE = 100;

type UserFallback = {
  id: string;
  userId: string | null;
  fallbackUserId: string | null;
};

async function backfillRows(
  label: string,
  findBatch: (afterId?: string) => Promise<UserFallback[]>,
  updateRow: (id: string, userId: string) => Promise<unknown>,
): Promise<void> {
  let afterId: string | undefined;
  let scanned = 0;
  let updated = 0;
  let skipped = 0;

  while (true) {
    const rows = await findBatch(afterId);

    if (rows.length === 0) {
      break;
    }

    scanned += rows.length;
    afterId = rows[rows.length - 1].id;

    const updates = rows
      .filter((row) => row.userId === null && row.fallbackUserId)
      .map((row) => ({ id: row.id, userId: row.fallbackUserId as string }));

    skipped += rows.length - updates.length;

    if (updates.length === 0) {
      continue;
    }

    await prisma.$transaction(
      updates.map((row) =>
        updateRow(row.id, row.userId),
      ),
    );

    updated += updates.length;
    console.log(`[backfill] ${label}: updated ${updated}/${scanned}`);
  }

  console.log(
    `[backfill] ${label}: complete (scanned=${scanned}, updated=${updated}, skipped=${skipped})`,
  );
}

async function backfillInvoiceUsers(): Promise<void> {
  await backfillRows(
    "invoices",
    async (afterId) => {
      const rows = await prisma.invoice.findMany({
        where: {
          user_id: null,
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        orderBy: { id: "asc" },
        take: BATCH_SIZE,
        select: {
          id: true,
          user_id: true,
          company: { select: { owner_id: true } },
          cash_register: {
            select: {
              operator_id: true,
            },
          },
        },
      });

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        fallbackUserId: row.cash_register.operator_id ?? row.company.owner_id,
      }));
    },
    (id, userId) =>
      prisma.invoice.updateMany({
        where: { id, user_id: null },
        data: { user_id: userId },
      }),
  );
}

async function backfillPaymentUsers(): Promise<void> {
  await backfillRows(
    "payments",
    async (afterId) => {
      const rows = await prisma.payment.findMany({
        where: {
          user_id: null,
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        orderBy: { id: "asc" },
        take: BATCH_SIZE,
        select: {
          id: true,
          user_id: true,
          invoice: {
            select: {
              user_id: true,
              company: { select: { owner_id: true } },
              cash_register: { select: { operator_id: true } },
            },
          },
        },
      });

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        fallbackUserId:
          row.invoice.user_id ??
          row.invoice.cash_register.operator_id ??
          row.invoice.company.owner_id,
      }));
    },
    (id, userId) =>
      prisma.payment.updateMany({
        where: { id, user_id: null },
        data: { user_id: userId },
      }),
  );
}

async function backfillCashMovementUsers(): Promise<void> {
  await backfillRows(
    "cash_movements",
    async (afterId) => {
      const rows = await prisma.cashMovement.findMany({
        where: {
          user_id: null,
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        orderBy: { id: "asc" },
        take: BATCH_SIZE,
        select: {
          id: true,
          user_id: true,
          cash_register: {
            select: {
              operator_id: true,
              business_unit: { select: { company: { select: { owner_id: true } } } },
            },
          },
        },
      });

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        fallbackUserId:
          row.cash_register.operator_id ??
          row.cash_register.business_unit.company.owner_id,
      }));
    },
    (id, userId) =>
      prisma.cashMovement.updateMany({
        where: { id, user_id: null },
        data: { user_id: userId },
      }),
  );
}

async function backfillGamingSessionUsers(): Promise<void> {
  await backfillRows(
    "gaming_sessions",
    async (afterId) => {
      const rows = await prisma.gamingSession.findMany({
        where: {
          user_id: null,
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        orderBy: { id: "asc" },
        take: BATCH_SIZE,
        select: {
          id: true,
          user_id: true,
          business_unit: { select: { company: { select: { owner_id: true } } } },
        },
      });

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        fallbackUserId: row.business_unit.company.owner_id,
      }));
    },
    (id, userId) =>
      prisma.gamingSession.updateMany({
        where: { id, user_id: null },
        data: { user_id: userId },
      }),
  );
}

async function backfillGamingSessionPaymentUsers(): Promise<void> {
  await backfillRows(
    "gaming_session_payments",
    async (afterId) => {
      const rows = await prisma.gamingSessionPayment.findMany({
        where: {
          user_id: null,
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        orderBy: { id: "asc" },
        take: BATCH_SIZE,
        select: {
          id: true,
          user_id: true,
          session: {
            select: {
              user_id: true,
              business_unit: { select: { company: { select: { owner_id: true } } } },
            },
          },
        },
      });

      return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        fallbackUserId:
          row.session.user_id ?? row.session.business_unit.company.owner_id,
      }));
    },
    (id, userId) =>
      prisma.gamingSessionPayment.updateMany({
        where: { id, user_id: null },
        data: { user_id: userId },
      }),
  );
}

async function main(): Promise<void> {
  console.log("[backfill] Starting user reference backfill...");

  await backfillGamingSessionUsers();
  await backfillInvoiceUsers();
  await backfillCashMovementUsers();
  await backfillPaymentUsers();
  await backfillGamingSessionPaymentUsers();

  console.log("[backfill] User reference backfill completed.");
}

main()
  .catch((error) => {
    console.error("[backfill] Failed to backfill user references:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });