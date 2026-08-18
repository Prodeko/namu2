"use client";

import { Modal } from "@/components/ui/modal";
import type { ModalNav } from "@/components/ui/modal";

import type { PostponementPolicy } from "./types";

interface AnnouncementActionsProps {
  /** Which postponement buttons to render. */
  policy: PostponementPolicy;
  /** Label for the primary button. */
  completeText?: string;
  /** Label for the "remind me later" button. */
  snoozeText?: string;
  /** Label for the "don't ask again" button. */
  dismissText?: string;
  /**
   * Custom primary-button handler. Defaults to resolving the flow with
   * `"complete"`. Override it to do extra work first (e.g. open another modal)
   * and only resolve `"complete"` once that work succeeds — leaving the
   * announcement eligible if the user backs out.
   */
  onComplete?: (nav: ModalNav) => void | Promise<void>;
}

/**
 * Standard action buttons for an announcement page. Renders exactly the buttons
 * the announcement's {@link PostponementPolicy} permits and wires each to the
 * matching {@link AnnouncementOutcome}. Drop it inside the page's content.
 *
 * The buttons stack vertically on mobile (primary on top) and lay out as a row
 * on tablet/desktop (primary on the right), so up to three options never get
 * cramped on a narrow bottom sheet.
 */
export const AnnouncementActions = ({
  policy,
  completeText = "Got it",
  snoozeText = "Remind me later",
  dismissText = "Don't ask again",
  onComplete,
}: AnnouncementActionsProps) => (
  <div className="mt-2 flex w-full flex-col-reverse gap-3 md:flex-row md:gap-6">
    {policy.canDismiss && (
      <Modal.ActionButton
        text={dismissText}
        intent="tertiary"
        onClick={(nav) => nav.resolve("dismiss")}
      />
    )}
    {policy.canSnooze && (
      <Modal.ActionButton
        text={snoozeText}
        intent="secondary"
        onClick={(nav) => nav.resolve("snooze")}
      />
    )}
    <Modal.ActionButton
      text={completeText}
      intent="primary"
      onClick={(nav) =>
        onComplete ? onComplete(nav) : nav.resolve("complete")
      }
    />
  </div>
);
