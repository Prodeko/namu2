"use client";

import { HiX } from "react-icons/hi";
import { HiPaperAirplane, HiPencil } from "react-icons/hi2";

import { WishObject } from "@/common/types";
import { AnimatedPopup } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { Input } from "@/components/ui/Input";
import { RadioInput } from "@/components/ui/RadioInput";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  wish: WishObject;
}

export const WishReplyModal = ({ wish }: Props) => {
  return (
    <AnimatedPopup
      TriggerComponent={
        <IconButton buttonType="button" sizing="md" Icon={HiPencil} />
      }
    >
      <div className="relative flex flex-col rounded-xl bg-neutral-50 px-20 py-20 shadow-lg portrait:w-[80vw] landscape:w-[50vw] ">
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
            <span className="text-2xl text-neutral-800">
              Liked by {wish.voteCount} users
            </span>
          </div>
          <RadioInput options={["Accepted", "Rejected"]} labelText="Decision" />
          <Input
            placeholderText="Write a message to the author of the wish"
            labelText="Message"
          />

          <Dialog.Close asChild>
            <FatButton
              buttonType="button"
              text="Submit decision"
              intent="primary"
              RightIcon={HiPaperAirplane}
            />
          </Dialog.Close>
        </div>
      </div>
    </AnimatedPopup>
  );
};
