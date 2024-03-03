"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";

import { useSlideinAnimation } from "@/animations/useSlideinAnimation";
import { Input } from "@/components/ui/Input";
import * as Dialog from "@radix-ui/react-dialog";
import { animated } from "@react-spring/web";

import { AddFunds } from "./AddFunds";
import { FatButton } from "./Buttons/FatButton";
import Card from "./Card";
import { RadioInput } from "./RadioInput";

const AnimatedDialog = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

interface Props {
  children: React.ReactNode;
}

export const AddFundsDialog = ({ children }: Props) => {
  const [amountToAdd, setAmountToAdd] = useState(0);

  const {
    containerAnimation,
    overlayAnimation,
    open,
    setOpen,
    toggleContainer,
  } = useSlideinAnimation();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <AnimatedOverlay
          style={overlayAnimation}
          className="fixed inset-0 z-20 bg-black bg-opacity-25"
        />
        <AnimatedDialog
          style={containerAnimation}
          className="fixed top-0 z-20 flex h-full w-full items-center justify-center"
        >
          <div className="flex flex-col items-center gap-12 rounded-[40px] bg-neutral-50 px-16 py-12">
            <h2 className="mt-6 text-5xl font-bold text-neutral-700">
              Add Funds
            </h2>
            <hr className="h-px w-full bg-neutral-300 opacity-90" />
            <AddFundsStep1
              amountToAdd={amountToAdd}
              setAmountToAdd={(value) => setAmountToAdd(value)}
            />
            <AddFundsStep2
              amountToAdd={amountToAdd}
              setAmountToAdd={setAmountToAdd}
            />
          </div>
        </AnimatedDialog>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface StepProps {
  amountToAdd: number;
  setAmountToAdd: (value: number) => void;
}

const AddFundsStep1 = ({ amountToAdd, setAmountToAdd }: StepProps) => {
  const handleValueChange = (value: string) =>
    setAmountToAdd(parseFloat(value));
  const radioRef = useRef();

  return (
    <>
      <p className="text-2xl text-neutral-500">
        Choose the amount you want to add
      </p>
      <RadioInput
        options={["5€", "10€", "15€", "Custom"]}
        style="rounded"
        onChange={handleValueChange}
        ref={radioRef}
      />
      <Input
        placeholderText="Custom amount..."
        value={amountToAdd}
        onChange={(e) => {
          handleValueChange(e.target.value);
          radioRef.current.setValueFromRef("Custom");
        }}
        type="number"
      />
      <div className="mt-6 flex w-full gap-6">
        <Dialog.Close asChild>
          <FatButton buttonType="button" text="Cancel" intent="secondary" />
        </Dialog.Close>
        <FatButton buttonType="button" text="Proceed" intent="primary" />
      </div>
    </>
  );
};

const AddFundsStep2 = ({ amountToAdd, setAmountToAdd }: StepProps) => {
  const getMobilePayLink = (sum) =>
    `https://mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=43477&amount=${sum}&comment=Namu&lock=1`;
  return (
    <>
      <QRCodeSVG value={getMobilePayLink(amountToAdd)} size={200} />
      <p className="text-2xl">Scan the following code with MobilePay to pay</p>
      <div className="mt-6 flex w-full gap-6">
        <Dialog.Close asChild>
          <FatButton buttonType="button" text="Cancel" intent="secondary" />
        </Dialog.Close>
        <FatButton buttonType="button" text="Done" intent="primary" />
      </div>
    </>
  );
};
