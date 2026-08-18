"use client";

import { LuSmartphoneNfc } from "react-icons/lu";

import { Modal, createModalFlow } from "@/components/ui/modal";

import { AnnouncementActions } from "../AnnouncementActions";
import type { AnnouncementOutcome } from "../types";

const RfidSetupPromptContent = () => (
  <Modal>
    <Modal.Page title="Login with Aalto acess card?" subtitle="No PIN needed">
      <div className="flex flex-col gap-6 pt-2">
        <LuSmartphoneNfc size={128} className="mx-auto text-primary-400" />
        <p className="text-neutral-500">
          You can register your physical aalto access card or any other NFC card
          (e.g. plussa-card) to your account and use it to authenticate at the
          guildroom tablet. No username or PIN required.
        </p>
        <AnnouncementActions
          policy={{ canSnooze: true, canDismiss: true }}
          completeText="Set up now"
        />
      </div>
    </Modal.Page>
  </Modal>
);

export const RfidSetupPromptFlow = createModalFlow<
  Record<string, never>,
  AnnouncementOutcome
>(() => <RfidSetupPromptContent />);
