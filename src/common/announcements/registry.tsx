import { showModal } from "@/components/ui/modal";
import { RfidSetupFlow } from "@/components/ui/modal/flows/RfidSetupFlow";
import { DeviceType } from "@prisma/client";

import { RfidSetupPromptFlow } from "./flows/RfidSetupPromptFlow";
import type { AnnouncementConfig } from "./types";

/**
 * Every announcement the app knows about. Content lives in each entry's `flow`;
 * the database only tracks the on/off switch and per-user history. Order here is
 * not significant — `priority` decides which one wins when several are eligible.
 *
 * Announcements default to OFF: a new entry is invisible until a superadmin
 * enables it from the admin page.
 */
export const ANNOUNCEMENTS: AnnouncementConfig[] = [
  {
    id: "rfid-login-setup",
    title: "RFID login setup prompt",
    flow: RfidSetupPromptFlow,
    policy: { canSnooze: true, canDismiss: true },
    delayHours: 24,
    deviceTypes: [DeviceType.GUILDROOM_TABLET],
    priority: 10,
    // The prompt has already closed by the time this runs, so opening the setup
    // flow here doesn't nest. Only count as complete if a card was registered.
    onComplete: async () => (await showModal(RfidSetupFlow)) === true,
  },
];

export const getAnnouncementById = (
  id: string,
): AnnouncementConfig | undefined =>
  ANNOUNCEMENTS.find((announcement) => announcement.id === id);
