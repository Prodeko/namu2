"use client";

import { HiPaperAirplane, HiPencil, HiXMark } from "react-icons/hi2";

import { useSlideinAnimation } from "@/animations/useSlideinAnimation";
import * as Dialog from "@radix-ui/react-dialog";
import { animated } from "@react-spring/web";

import { FatButton } from "./Buttons/FatButton";
import { IconButton } from "./Buttons/IconButton";
import { Input } from "./Input";
import { RadioInput } from "./RadioInput";

const AnimatedDialog = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

export const WishReplyModal = () => {
  const { containerAnimation, overlayAnimation, open, setOpen } =
    useSlideinAnimation();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton buttonType="button" sizing="md" Icon={HiPencil} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <AnimatedOverlay
          style={overlayAnimation}
          className="fixed inset-0 bg-black bg-opacity-25"
        />
        <AnimatedDialog
          style={containerAnimation}
          className="fixed top-0 flex h-full w-full items-center justify-center"
        >
          <div className="relative flex flex-col rounded-xl bg-neutral-50 px-20 py-20 shadow-lg portrait:w-[80vw] landscape:w-[50vw] ">
            <div className=" flex flex-col gap-8">
              <Dialog.Close asChild>
                <IconButton
                  className="absolute right-10 top-10 z-20"
                  buttonType="button"
                  Icon={HiXMark}
                  sizing="sm"
                />
              </Dialog.Close>
              <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-semibold text-neutral-800">
                  Jaffakeksit
                </h2>
                <span className="text-2xl text-neutral-800">
                  Liked by 75 users
                </span>
              </div>
              <RadioInput
                options={["Accepted", "Rejected"]}
                labelText="Decision"
              />
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
        </AnimatedDialog>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
