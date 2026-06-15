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

An announcement may also declare an optional **completion condition** — see
[Completion conditions](#completion-conditions). The condition runs on the
server, so it lives separately from this (client-bundled) config rather than on
the entry itself.

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

## Completion conditions

Some announcements ask the user to do something the app can already check —
link a Prodeko account, register an RFID card. For those, showing the prompt to
someone who has _already_ done it is just noise. A **completion condition**
fixes this: a small server-side check that answers "has this user already done
the thing?"

- Conditions are defined in a **server-only module**, keyed by announcement id,
  not on the code config above — they read the database, which must never reach
  the client bundle. An announcement without an entry simply has no condition
  and behaves as before.
- The check runs as part of the per-login lookup, **on the server**. For each
  switched-on announcement whose status is still open (never decided, or only
  snoozed), the condition is evaluated. If it is satisfied, the announcement is
  silently marked **Complete** for that user and is never shown — so a user who
  did the thing out of band (or before the announcement was switched on) is
  never nagged, and the completion is recorded for the admin stats.
- The check is **device-agnostic**: it runs wherever the user logs in, even on
  a device the announcement doesn't target. Completing a tablet-only prompt for
  a card-holder who logs in on the web is harmless and keeps their state tidy.
- A user who already chose **Don't ask again** keeps that status — a satisfied
  condition won't overwrite an explicit dismissal. And if a condition errors
  (say the database hiccups), that one announcement is simply skipped for the
  login and re-checked next time; it never falsely completes or blocks the rest.

So the full per-login decision for one announcement is: already Complete or
Dismissed? → do nothing. Otherwise, condition satisfied? → mark Complete, don't
show. Otherwise → fall through to the normal device / snooze / priority rules
and maybe show it.

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
- Its **completion condition** checks whether the user already has a registered
  card. Anyone who does — whether they set it up here, on the account page, or
  before the prompt existed — is marked complete and never sees it. The "Set up
  now" path handles completing it in the moment; the condition handles everyone
  who did it some other way.

It ships switched off; a superadmin turns it on when the feature is ready, and
can watch the completion count climb from the admin page.
