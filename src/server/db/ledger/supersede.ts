/**
 * The single place the versioned-row (SCD type-2) supersession invariant lives.
 *
 * Every versioned table — `UserBalance`, `ProductPrice` — records a change by
 * closing the currently-active row (`isActive=false`, `validEnd=now`) and
 * appending a fresh active row. Callers used to hand-write this dance; now they
 * express intent through the `Balance` / `Price` verbs and the ordering lives
 * here once.
 *
 * The caller supplies the table-specific Prisma calls as typed closures, so the
 * core stays fully type-safe while owning only the control flow:
 *   read active → compute next → (close active) → append.
 *
 * Note: nothing guarantees exactly one active row under concurrency — two
 * simultaneous supersessions can both read the same active row and lose an
 * update. This is a known, accepted limitation (see CONTEXT.md).
 */

export interface VersionedRow {
  validStart: Date;
}

interface SupersedeOps<TRow extends VersionedRow, TData> {
  /** Read the current active row, or `null` if none exists yet. */
  findActive: () => Promise<TRow | null>;
  /**
   * Compute the new row's payload from the active row. Return `null` to skip
   * entirely (e.g. the value is unchanged). May throw a domain error to reject
   * the write (e.g. insufficient balance).
   */
  nextData: (active: TRow | null) => TData | null;
  /** Close the active row: `isActive=false`, `validEnd=now`. */
  closeActive: (active: TRow) => Promise<unknown>;
  /** Append a new active row carrying `data`. */
  append: (data: TData) => Promise<unknown>;
}

export const supersedeActiveRow = async <TRow extends VersionedRow, TData>(
  ops: SupersedeOps<TRow, TData>,
): Promise<void> => {
  const active = await ops.findActive();
  const data = ops.nextData(active);
  if (data === null) return; // unchanged → no-op
  if (active) await ops.closeActive(active);
  await ops.append(data);
};
