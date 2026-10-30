"use client";

/** The on/off switch shared by the announcement rows and the guildroom card. */
export const Toggle = ({
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
