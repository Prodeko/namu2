"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { HiPaperAirplane, HiPencil } from "react-icons/hi2";

import { WishObject } from "@/common/types";
import { AnimatedPopup } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { Input } from "@/components/ui/Input";
import { RadioInput } from "@/components/ui/RadioInput";
import { editWish } from "@/server/db/utils/wish";
import { WishStatus } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  wish: WishObject;
}

export const WishReplyModal = ({ wish }: Props) => {
  const [decision, setDecision] = useState<WishStatus>(wish.status);
  const [message, setMessage] = useState<string>(wish.resolutionMessage || "");
  const router = useRouter();

  const submitDecision = async () => {
    await editWish(wish.id, decision, message);
    router.refresh();
  };

  const handleDecisionChange = (decision: string) => {
    setDecision(decision.toUpperCase() as WishStatus);
    if (decision === "Open") {
      setMessage("");
    }
  };
  return (
    <AnimatedPopup
      TriggerComponent={
        <IconButton buttonType="button" sizing="md" Icon={HiPencil} />
      }
    >
      <div className="relative flex flex-col rounded-xl px-20 py-20">
        <div className=" flex flex-col gap-8">
          <Dialog.Close asChild>
            <IconButton
              className="absolute right-10 top-10 z-20"
              buttonType="button"
              Icon={HiX}
              sizing="sm"
            />
          </Dialog.Close>
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-semibold text-neutral-800">
              {wish.name}
            </h2>
            <span className="text-xl text-neutral-600">
              Liked by {wish.voteCount} users
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl text-neutral-800">{wish.description}</p>
            <a
              href={wish.webUrl || undefined}
              className="text-2xl text-primary-500 underline"
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
            <Input
              placeholderText="Write a message to the author of the wish"
              labelText="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}

          <Dialog.Close asChild>
            <FatButton
              buttonType="button"
              text="Submit decision"
              intent="primary"
              RightIcon={HiPaperAirplane}
              onClick={submitDecision}
            />
          </Dialog.Close>
        </div>
      </div>
    </AnimatedPopup>
  );
};
