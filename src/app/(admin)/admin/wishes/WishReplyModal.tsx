"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { HiPaperAirplane, HiPencil } from "react-icons/hi2";

import { WishObject } from "@/common/types";
import { AnimatedPopup } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { InputWithLabel } from "@/components/ui/Input";
import { RadioInput } from "@/components/ui/RadioInput";
import { editWish } from "@/server/db/queries/wish";
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
      <div className="flex max-h-[95vh] flex-col overflow-scroll rounded-xl bg-neutral-50 px-3 py-6 md:px-12 md:py-12 portrait:w-[80vw] landscape:w-[50vw] ">
        <div className=" flex flex-col gap-8">
          <div className="flex w-full items-start justify-between">
            <p className="flex flex-col gap-2 text-xl font-bold text-primary-400 md:text-3xl">
              {wish.name}
              <span className="text-xl font-normal text-neutral-600">
                Liked by {wish.voteCount} users
              </span>
            </p>
            <Dialog.Close asChild>
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-lg text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl">
                <HiX />
              </div>
            </Dialog.Close>
          </div>
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
