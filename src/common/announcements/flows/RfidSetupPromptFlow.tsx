"use client";

import { Modal, createModalFlow } from "@/components/ui/modal";

import { AnnouncementActions } from "../AnnouncementActions";
import type { AnnouncementOutcome } from "../types";

const RfidSetupPromptContent = () => (
  <Modal>
    <Modal.Page
      title="Faster login with your access card"
      subtitle="Tap your Aalto access card to log in — no PIN needed."
    >
      <p className="py-2 text-neutral-600">
        Register your access card now and next time you can sign in on this
        tablet just by holding your card to the reader.
      </p>
      <AnnouncementActions
        policy={{ canSnooze: true, canDismiss: true }}
        completeText="Set up now"
      />
    </Modal.Page>
  </Modal>
);

export const RfidSetupPromptFlow = createModalFlow<
  Record<string, never>,
  AnnouncementOutcome
>(() => <RfidSetupPromptContent />);
