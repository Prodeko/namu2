import type { ModalFlow } from "@/components/ui/modal";
import type { DeviceType } from "@prisma/client";

/**
 * The decision a user makes when an announcement is shown. Returned by an
 * announcement's modal flow and mapped to a persisted status by the runner:
 *
 * - `snooze`   → SNOOZED   (re-show after `delayHours`)
 * - `dismiss`  → DISMISSED (never again)
 * - `complete` → COMPLETED (never again)
 *
 * Closing the modal with the X/Escape resolves to `undefined` and writes
 * nothing, so the announcement is simply re-shown on the next login.
 */
export type AnnouncementOutcome = "snooze" | "dismiss" | "complete";

/** Which postponement buttons an announcement offers. */
export interface PostponementPolicy {
  /** Offer a "Remind me later" button (re-shows after `delayHours`). */
  canSnooze: boolean;
  /** Offer a "Don't ask again" button. */
  canDismiss: boolean;
}

/**
 * A code-defined announcement. The content lives in `flow`; everything else is
 * metadata the runner and admin page use to decide when and where to show it.
 */
export interface AnnouncementConfig {
  /** Stable id; must match the `AnnouncementSetting` row id. */
  id: string;
  /** Human-readable label shown on the admin page. */
  title: string;
  /** The modal flow rendered when this announcement fires. */
  flow: ModalFlow<Record<string, never>, AnnouncementOutcome>;
  /** Which postponement options the flow offers. */
  policy: PostponementPolicy;
  /** Hours to wait before re-showing after a "Remind me later". */
  delayHours: number;
  /** Device types to show on; empty means all devices. */
  deviceTypes: DeviceType[];
  /** Higher wins when several announcements are eligible on the same login. */
  priority: number;
  /**
   * Optional follow-up run by the runner *after* the flow resolves `"complete"`
   * and *after* it has closed — so it can open another modal without nesting
   * (nested modals dismiss their parent). Return `true` to record COMPLETED,
   * `false` to record nothing and leave the announcement eligible next login.
   */
  onComplete?: () => Promise<boolean>;
}
