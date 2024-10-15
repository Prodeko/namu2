"use client";

import { QRCodeSVG } from "qrcode.react";
import { ReactNode, useRef, useState } from "react";
import { HiX } from "react-icons/hi";

import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Input } from "@/components/ui/Input";
import { RadioInput, RadioRefActions } from "@/components/ui/RadioInput";

import { AddFundsInput } from "./AddFundsInput";

interface Props {
  children: ReactNode;
}

export const AddFundsDialog = ({ children }: Props) => {
  const [amountToAdd, setAmountToAdd] = useState(0);
  const [step, setStep] = useState(0);
  const steps = [AddFundsStep1, AddFundsStep2];
  const popupRef = useRef<PopupRefActions>();

  const closeModal = () => {
    setStep(0);
    popupRef?.current?.closeContainer();
  };

  const currentStep = () => {
    const Current = steps[step];
    if (!Current) return null;
    return (
      <Current amountToAdd={amountToAdd} setAmountToAdd={setAmountToAdd} />
    );
  };
  const augmentStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else closeModal();
  };
  const decreaseStep = () => {
    if (step > 0) setStep(step - 1);
    else closeModal();
  };
  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={children}>
      <div className="flex w-full flex-col items-center gap-12 px-16 py-12">
        <div className="-mb-12 flex w-full items-center justify-between">
          <p className="text-3xl font-bold text-primary-400">Add Funds</p>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-4xl text-primary-400"
            onClick={closeModal}
          >
            <HiX />
          </div>
        </div>

        {currentStep()}
        <div className="mt-6 flex w-full gap-6">
          <FatButton
            buttonType="button"
            text={step === steps.length - 1 ? "Done" : "Proceed"}
            intent="primary"
            onClick={augmentStep}
          />
        </div>
      </div>
    </AnimatedPopup>
  );
};

interface StepProps {
  amountToAdd: number;
  setAmountToAdd: (value: number) => void;
}

const AddFundsStep1 = ({ amountToAdd, setAmountToAdd }: StepProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleValueChange = (value: string) => {
    setAmountToAdd(parseFloat(value));
    if (inputRef.current) {
      const newWidth = value === "Custom" ? 1 : value.length;
      inputRef.current.style.width = `calc(${newWidth}ch - calc(${newWidth} * 0.15rem))`;
      if (value === "Custom") {
        inputRef.current.focus();
      }
    }
  };
  const radioRef = useRef<RadioRefActions<string>>(null);

  return (
    <>
      <h2 className="mt-6 text-4xl font-bold text-neutral-700">
        Choose amount
      </h2>
      <RadioInput
        options={["5€", "10€", "15€", "Custom"]}
        style="rounded"
        onChange={handleValueChange}
      />
      <AddFundsInput
        className="w-20"
        value={amountToAdd}
        ref={inputRef}
        onChange={(e) => {
          handleValueChange(e.target.value);
          radioRef?.current?.setValueFromRef("Custom");
        }}
      />
    </>
  );
};

const AddFundsStep2 = ({ amountToAdd, setAmountToAdd }: StepProps) => {
  const getMobilePayLink = (sum: number) =>
    `https://mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=43477&amount=${sum}&comment=Namutalletus&lock=1`;
  return (
    <>
      <h2 className="mt-6 text-4xl font-bold text-neutral-700">
        Scan the QR code
      </h2>
      <QRCodeSVG value={getMobilePayLink(amountToAdd)} size={256} />
      <p className="text-2xl ">
        Or manually pay <b>{amountToAdd}€</b> to the number <b>43477</b>
      </p>
    </>
  );
};
