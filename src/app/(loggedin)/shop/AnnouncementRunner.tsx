"use client";

import { useEffect } from "react";

import { ANNOUNCEMENT_GUARD_KEY } from "@/common/announcements/AnnouncementGuardReset";
import { ANNOUNCEMENTS } from "@/common/announcements/registry";
import type { AnnouncementConfig } from "@/common/announcements/types";
import { getDeviceType } from "@/common/utils";
import { showModal } from "@/components/ui/modal";
import { getActiveAnnouncementStates } from "@/server/actions/announcements/getActiveAnnouncementStates";
import { recordAnnouncementOutcome } from "@/server/actions/announcements/recordAnnouncementOutcome";
import type { DeviceType } from "@prisma/client";

const HOUR_MS = 60 * 60 * 1000;

const isEligible = (
  announcement: AnnouncementConfig,
  device: DeviceType,
  state: { status: string; lastShownAt: Date } | undefined,
  now: number,
): boolean => {
  if (
    announcement.deviceTypes.length > 0 &&
    !announcement.deviceTypes.includes(device)
  )
    return false;

  if (!state) return true; // never decided
  if (state.status === "DISMISSED" || state.status === "COMPLETED")
    return false;
  // SNOOZED: eligible again once the delay has elapsed.
  return (
    now >=
    new Date(state.lastShownAt).getTime() + announcement.delayHours * HOUR_MS
  );
};

/**
 * Runs once per login when the user lands on the shop: picks the highest-priority
 * eligible announcement and shows it, recording the outcome. Renders nothing.
 */
export const AnnouncementRunner = () => {
  useEffect(() => {
    if (sessionStorage.getItem(ANNOUNCEMENT_GUARD_KEY) !== null) return;
    sessionStorage.setItem(ANNOUNCEMENT_GUARD_KEY, "1");

    const run = async () => {
      const { activeIds, states } = await getActiveAnnouncementStates();
      if (activeIds.length === 0) return;

      const stateById = new Map(states.map((s) => [s.announcementId, s]));
      const device = getDeviceType();
      const now = Date.now();

      const chosen = ANNOUNCEMENTS.filter(
        (a) =>
          activeIds.includes(a.id) &&
          isEligible(a, device, stateById.get(a.id), now),
      ).sort((a, b) => b.priority - a.priority)[0];
      if (!chosen) return;

      const outcome = await showModal(chosen.flow);
      if (!outcome) return; // dismissed via X/Escape — record nothing

      // For a "complete", run any follow-up (e.g. the RFID setup flow) now that
      // the announcement modal has closed, so nothing nests. The follow-up
      // decides whether the completion actually happened.
      if (outcome === "complete" && chosen.onComplete) {
        const confirmed = await chosen.onComplete();
        if (!confirmed) return; // user backed out — stays eligible next login
      }

      await recordAnnouncementOutcome(chosen.id, outcome);
    };

    void run();
  }, []);

  return null;
};
