"use client";

import { signIn } from "next-auth/react";
import { BsGearWide } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { TbCandy } from "react-icons/tb";

import { getKeycloakProviderId } from "@/common/utils";
import { Modal, createModalFlow } from "@/components/ui/modal";
import { beginKeycloakLink } from "@/server/actions/auth/linkKeycloak";

import { AnnouncementActions } from "../AnnouncementActions";
import type { AnnouncementOutcome } from "../types";

const ProdekoLinkPromptContent = () => (
  <Modal>
    {/* Non-dismissible: the user must pick "Link now" or "Remind me later" —
        there's no X, Escape or outside-click escape hatch. */}
    <Modal.Page dismissible={false} title="Please link your Prodeko account">
      <div className="flex flex-col gap-6 pt-2">
        <MdManageAccounts size={128} className="mx-auto text-primary-400" />
        <p className="text-neutral-500">
          Linking your Prodeko account lets you recover access if you ever
          forget your PIN and adds a convenient way to sign in. You will still
          be able to sign in using your current credentials or NFC access card.
          <br />
          <br />
          Linking can be done on the guildroom tablet or on your phone by
          heading to{" "}
          <span className="font-semibold text-primary-400">
            namu.prodeko.org
          </span>
          . Did you know you can also use Namukilke on your phone?
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
      </div>
    </Modal.Page>
  </Modal>
);

export const ProdekoLinkPromptFlow = createModalFlow<
  Record<string, never>,
  AnnouncementOutcome
>(() => <ProdekoLinkPromptContent />);
