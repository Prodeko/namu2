"use client";

import { useState } from "react";
import { HiTrash } from "react-icons/hi";
import { HiPaperAirplane } from "react-icons/hi2";

import { WishObject } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { RadioInput } from "@/components/ui/RadioInput";
import { deleteWish } from "@/server/actions/admin/deleteWish";
import { editWish } from "@/server/db/queries/wish";
import { WishStatus } from "@prisma/client";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { createModalFlow } from "../modalSystem";

const WishReplyContent = ({ wish }: { wish: WishObject }) => {
  const nav = useModalNav();
  const [decision, setDecision] = useState<WishStatus>(wish.status);
  const [message, setMessage] = useState<string>(wish.resolutionMessage || "");

  const handleDecisionChange = (decision: string) => {
    setDecision(decision.toUpperCase() as WishStatus);
    if (decision === "Open") {
      setMessage("");
    }
  };

  const handleDelete = async () => {
    // `deleteWish` revalidates and redirects to /admin/wishes; close first so
    // the modal doesn't linger over the navigation.
    nav.close();
    await deleteWish(wish.id);
  };

  const submitDecision = async () => {
    await editWish(wish.id, decision, message);
    nav.close();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-lg text-neutral-800 md:text-2xl">
          {wish.description}
        </p>
        <a
          href={wish.webUrl || undefined}
          target="_blank" // Open in new tab
          className="text-2xl text-primary-500 underline"
          rel="noreferrer"
        >
          {wish.webUrl}
        </a>
      </div>
      <RadioInput
        options={["Open", "Accepted", "Rejected"]}
        labelText="Decision"
        onChange={handleDecisionChange}
        defaultValue={wish.status[0] + wish.status.slice(1).toLowerCase()}
      />
      {decision !== "OPEN" && (
        <InputWithLabel
          placeholder="Write a message to the author of the wish"
          labelText="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      )}
      <div className="flex w-full gap-2">
        <FatButton
          buttonType="button"
          type="button"
          intent={"secondary"}
          RightIcon={HiTrash}
          text={"Delete"}
          onClick={() => void handleDelete()}
        />
        <FatButton
          buttonType="button"
          text="Submit"
          intent="primary"
          RightIcon={HiPaperAirplane}
          onClick={() => void submitDecision()}
        />
      </div>
    </div>
  );
};

export const WishReplyFlow = createModalFlow<{ wish: WishObject }>(
  ({ wish }) => (
    <Modal>
      <Modal.Page
        title={wish.name}
        subtitle={`Liked by ${wish.voteCount} users`}
      >
        <WishReplyContent wish={wish} />
      </Modal.Page>
    </Modal>
  ),
);
