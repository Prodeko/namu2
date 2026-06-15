"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { ANNOUNCEMENTS } from "@/common/announcements/registry";
import { translatePrismaDeviceType } from "@/common/enumTranslations";
import type {
  AnnouncementCounts,
  AnnouncementStats,
} from "@/server/actions/announcements/getAnnouncementStats";
import { setAnnouncementActive } from "@/server/actions/announcements/setAnnouncementActive";

interface Props {
  initialActive: Record<string, boolean>;
  stats: AnnouncementStats;
}

const policyLabel = (canSnooze: boolean, canDismiss: boolean): string => {
  const parts: string[] = [];
  if (canSnooze) parts.push("Remind me later");
  if (canDismiss) parts.push("Don't ask again");
  return parts.length > 0 ? parts.join(" · ") : "One-off";
};

const Toggle = ({
  on,
  disabled,
  onClick,
}: {
  on: boolean;
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    disabled={disabled}
    onClick={onClick}
    className={`relative h-8 w-14 flex-none rounded-full transition-colors disabled:opacity-50 ${
      on ? "bg-primary-400" : "bg-neutral-300"
    }`}
  >
    <span
      className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${
        on ? "left-7" : "left-1"
      }`}
    />
  </button>
);

const CountPill = ({ label, value }: { label: string; value: number }) => (
  <span className="flex flex-col items-center rounded-lg bg-neutral-100 px-3 py-1">
    <span className="text-lg font-semibold text-neutral-800">{value}</span>
    <span className="text-xs text-neutral-500">{label}</span>
  </span>
);

export const AnnouncementAdminList = ({ initialActive, stats }: Props) => {
  const [active, setActive] = useState<Record<string, boolean>>(initialActive);
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const toggle = async (id: string) => {
    const next = !active[id];
    setActive((prev) => ({ ...prev, [id]: next }));
    setPending((prev) => ({ ...prev, [id]: true }));
    try {
      await setAnnouncementActive(id, next);
      toast.success(
        next ? "Announcement turned on" : "Announcement turned off",
      );
    } catch (error) {
      setActive((prev) => ({ ...prev, [id]: !next })); // revert
      toast.error(`Failed to update announcement: ${error}`);
    } finally {
      setPending((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <section className="flex w-full max-w-screen-md flex-col gap-4 px-5 md:px-12">
      <h1 className="text-2xl font-bold text-neutral-800 md:text-3xl">
        Announcements
      </h1>
      <p className="text-neutral-500">
        Turn announcements on or off. Counts are aggregate across all users.
      </p>
      <div className="flex flex-col divide-y-2 divide-primary-100">
        {ANNOUNCEMENTS.map((announcement) => {
          const counts: AnnouncementCounts = stats.byAnnouncement[
            announcement.id
          ] ?? { SNOOZED: 0, DISMISSED: 0, COMPLETED: 0 };
          const interacted =
            counts.SNOOZED + counts.DISMISSED + counts.COMPLETED;
          const neverInteracted = Math.max(stats.totalUsers - interacted, 0);
          const devices =
            announcement.deviceTypes.length === 0
              ? "All devices"
              : announcement.deviceTypes
                  .map(translatePrismaDeviceType)
                  .join(", ");

          return (
            <div
              key={announcement.id}
              className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between md:gap-6"
            >
              <div className="flex flex-col gap-1">
                <span className="text-lg font-medium text-neutral-800 md:text-xl">
                  {announcement.title}
                </span>
                <span className="text-sm text-neutral-500">
                  {devices} ·{" "}
                  {policyLabel(
                    announcement.policy.canSnooze,
                    announcement.policy.canDismiss,
                  )}
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  <CountPill label="Completed" value={counts.COMPLETED} />
                  <CountPill label="Dismissed" value={counts.DISMISSED} />
                  <CountPill label="Snoozed" value={counts.SNOOZED} />
                  <CountPill label="Untouched" value={neverInteracted} />
                </div>
              </div>
              <Toggle
                on={active[announcement.id] ?? false}
                disabled={pending[announcement.id] ?? false}
                onClick={() => void toggle(announcement.id)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
