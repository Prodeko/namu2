"use client";

import { signIn } from "next-auth/react";

import { getKeycloakProviderId } from "@/common/utils";
import { Modal, createModalFlow } from "@/components/ui/modal";
import { beginKeycloakLink } from "@/server/actions/auth/linkKeycloak";

import { AnnouncementActions } from "../AnnouncementActions";
import type { AnnouncementOutcome } from "../types";

const ProdekoLinkPromptContent = () => (
  <Modal>
    {/* Non-dismissible: the user must pick "Link now" or "Remind me later" —
        there's no X, Escape or outside-click escape hatch. */}
    <Modal.Page
      dismissible={false}
      title="Link your Prodeko account"
      subtitle="Reset your PIN if you forget it, and sign in more securely."
    >
      <p className="py-2 text-neutral-600">
        Linking your Prodeko account lets you recover access if you ever forget
        your PIN, and adds a safer way to sign in. You&apos;ll be taken to
        Prodeko to confirm — it only takes a moment.
      </p>
      <AnnouncementActions
        policy={{ canSnooze: true, canDismiss: false }}
        completeText="Link now"
        // signIn redirects the whole page to Keycloak, so the flow never
        // resolves a "complete" outcome and nothing needs to be recorded. On
        // a failed start we simply return, leaving the (non-dismissible) modal
        // open so the user can retry or choose "Remind me later".
        onComplete={async () => {
          const begin = await beginKeycloakLink();
          if (!begin.ok) return;
          await signIn(getKeycloakProviderId(), {
            callbackUrl: "/auth/callback?intent=link",
          });
        }}
      />
    </Modal.Page>
  </Modal>
);

export const ProdekoLinkPromptFlow = createModalFlow<
  Record<string, never>,
  AnnouncementOutcome
>(() => <ProdekoLinkPromptContent />);
