# Announcements

A small system for showing users something they should be aware of the moment
they arrive at the shop after logging in — a changelog, an account-migration
request, a prompt to set up faster login, and so on. An announcement is almost
always a **modal flow** (see `modal_flow.md`); the announcement system decides
_whether_, _when_, and _to whom_ to show it, and remembers what each user did so
nobody gets nagged.

## How it works at a glance

- Announcement **content lives in code**. The database stores only two things:
  whether each announcement is switched on, and a per-user history row once a
  user has made a choice.
- When a user lands on the shop after logging in, the system looks at every
  switched-on announcement, keeps the ones that are eligible for that user and
  device, and shows the single highest-priority one. The rest wait for another
  day.
- The check runs **once per login**. Navigating around while logged in won't
  make an announcement pop again; a fresh login (even on a shared tablet that is
  never logged out) re-runs the check.

## Defining an announcement

An announcement is a small bundle of configuration plus the modal flow to show:

```ts
{
  id: "rfid-login-setup",          // stable, unique, also used by the admin switch
  title: "RFID login setup prompt", // label shown to admins
  flow: <the modal flow to render>,
  policy: { canSnooze: true, canDismiss: true },
  delayHours: 24,                   // wait before re-showing a snoozed announcement
  deviceTypes: ["GUILDROOM_TABLET"],// where to show it; empty means everywhere
  priority: 10,                     // higher wins when several are eligible at once
}
```

A new announcement always starts **off**. It is invisible to users until a
superadmin switches it on, so merging the code never blasts everyone by
surprise — you deploy first, then enable when you're ready.

## Postponement and outcomes

Every announcement ends in one of a few outcomes, and the outcome decides
whether (and when) the user sees it again:

- **Remind me later** — the announcement is snoozed and becomes eligible again
  after the configured delay. Offer this with `canSnooze`.
- **Don't ask again** — the announcement is suppressed for that user forever.
  Offer this with `canDismiss`.
- **Complete** — the user finished what the announcement asked (or it was a
  one-off worth showing once). It is never shown again. The primary button is
  always present; its behaviour is customizable, so it can kick off another step
  — for example opening a setup flow — and only count as complete once that
  step succeeds.
- **Closed without choosing** — dismissing the modal with the X or Escape
  records nothing, so the announcement simply comes back on the next login.

The standard button row is rendered from the `policy`, so every announcement
offers a consistent set of choices without re-implementing them. A pure one-off
(no snooze, no dismiss) just shows the primary button.

## Targeting by device

`deviceTypes` limits an announcement to specific devices — handy for prompts
that only make sense in one place, like an access-card setup prompt that should
only appear on the guildroom tablet. Leave it empty to show on every device.

## Admin controls

Superadmins get an **Announcements** page. For each announcement it shows where
it runs and which postponement options it offers, an on/off switch, and
aggregate engagement counts — how many users completed, dismissed, snoozed, or
have not yet interacted. No individual user data is shown. Turning announcements
on and off is the only thing the admin page changes; everything else about an
announcement is defined in code.

## Worked example: the RFID login prompt

The guildroom tablet supports logging in by tapping an access card, but only if
the user has registered their card. The RFID login prompt announces this:

- It targets **only the guildroom tablet**.
- A user can **remind me later** (it returns after the delay) or **don't ask
  again** (it never returns).
- The primary **Set up now** button walks the user straight through registering
  their card. Only a successful registration counts as complete; if the user
  backs out, the prompt is still eligible next time.

It ships switched off; a superadmin turns it on when the feature is ready, and
can watch the completion count climb from the admin page.
