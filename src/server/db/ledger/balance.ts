import type { GenericClient } from "@/server/db/utils/dbTypes";
import { AccountBalanceError } from "@/server/exceptions/exception";
import { Prisma } from "@prisma/client";

import { supersedeActiveRow } from "./supersede";

type Amount = number | Prisma.Decimal;

/**
 * The active-balance row read/close/append closures for one user. Shared by
 * `credit` and `debit`; only the arithmetic and the guards differ between them.
 */
const balanceTable = (client: GenericClient, userId: number) => ({
  findActive: () =>
    client.userBalance.findFirst({ where: { userId, isActive: true } }),
  closeActive: (active: { validStart: Date }) =>
    client.userBalance.update({
      where: { userId_validStart: { userId, validStart: active.validStart } },
      data: { isActive: false, validEnd: new Date() },
    }),
  append: (data: { balance: Prisma.Decimal }) =>
    client.userBalance.create({ data: { userId, ...data } }),
});

/** Add `amount` to a user's balance. A user with no balance yet starts at 0. */
const credit = (client: GenericClient, userId: number, amount: Amount) =>
  supersedeActiveRow({
    ...balanceTable(client, userId),
    nextData: (active) => ({
      balance: (active?.balance ?? new Prisma.Decimal(0)).plus(amount),
    }),
  });

/**
 * Subtract `amount` from a user's balance. Owns the money rule: throws
 * `AccountBalanceError` if the user has no balance row or the result would go
 * negative. Arithmetic stays in `Decimal` — no float round-trips.
 */
const debit = (client: GenericClient, userId: number, amount: Amount) =>
  supersedeActiveRow({
    ...balanceTable(client, userId),
    nextData: (active) => {
      if (!active) {
        throw new AccountBalanceError({
          cause: "balance_lookup_error",
          message: "User balance not found",
        });
      }
      const next = active.balance.minus(amount);
      if (next.isNegative()) {
        throw new AccountBalanceError({
          cause: "insufficient_balance",
          message: "User balance not enough",
        });
      }
      return { balance: next };
    },
  });

export const Balance = { credit, debit };
