"use client";

import { QRCodeSVG } from "qrcode.react";
import { ReactNode, useRef, useState } from "react";

import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Input } from "@/components/ui/Input";
import { RadioInput, RadioRefActions } from "@/components/ui/RadioInput";

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
      <div className="flex flex-col items-center gap-12 px-12 py-12">
        <h2 className="mt-6 text-5xl font-bold text-neutral-700">Add Funds</h2>
        {currentStep()}
        <div className="mt-6 flex w-full gap-6">
          <FatButton
            buttonType="button"
            text="Cancel"
            intent="secondary"
            onClick={decreaseStep}
          />
          <FatButton
            buttonType="button"
            text="Proceed"
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
  const handleValueChange = (value: string) =>
    setAmountToAdd(parseFloat(value));
  const radioRef = useRef<RadioRefActions<string>>(null);

  return (
    <>
      <p className="text-2xl text-neutral-500">
        Choose the amount you want to add
      </p>
      <RadioInput
        options={["5€", "10€", "15€", "Custom"]}
        style="rounded"
        onChange={handleValueChange}
      />
      <Input
        placeholder="Custom amount..."
        className="w-full"
        value={amountToAdd}
        onChange={(e) => {
          handleValueChange(e.target.value);
          radioRef?.current?.setValueFromRef("Custom");
        }}
        type="number"
      />
    </>
  );
};

const AddFundsStep2 = ({ amountToAdd, setAmountToAdd }: StepProps) => {
  const getMobilePayLink = (sum: number) =>
    `https://mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=43477&amount=${sum}&comment=Namutalletus&lock=1`;
  return (
    <>
      <p className=" text-2xl">Scan the following code with MobilePay to pay</p>
      <QRCodeSVG value={getMobilePayLink(amountToAdd)} size={256} />
      <p className="text-2xl ">
        Or manually pay <b>{amountToAdd}€</b> to the number <b>43477</b>
      </p>
    </>
  );
};
