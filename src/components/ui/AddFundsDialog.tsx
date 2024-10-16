"use client";

import { QRCodeSVG } from "qrcode.react";
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiX } from "react-icons/hi";

import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { RadioInput, RadioRefActions } from "@/components/ui/RadioInput";
import { addFundsAction } from "@/server/actions/transaction/addFunds";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { AddFundsInput } from "./AddFundsInput";
import { ErrorToast } from "./Toasts/ErrorToast";
import { StripeExpressPayment } from "./payment/StripeExpressPayment";

interface Props {
  children: ReactNode;
}

type ModalController = {
  amountToAdd: number;
  setAmountToAdd: Dispatch<SetStateAction<number>>;
  closeModal: () => void;
};

export const AddFundsDialog = ({ children }: Props) => {
  const [amountToAdd, setAmountToAdd] = useState(0);
  const [step, setStep] = useState(0);
  const [addingFunds, setAddingFunds] = useState(false);
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  const steps = [AddFundsStep1, AddFundsStep2, AddFundsStep3];
  const popupRef = useRef<PopupRefActions>();

  const closeModal = () => {
    setStep(0);
    setAmountToAdd(0);

    popupRef?.current?.closeContainer();
  };

  const controller = {
    amountToAdd,
    setAmountToAdd,
    closeModal,
  } as ModalController;

  const currentStep = () => {
    const Current = steps[step];
    if (!Current) return null;
    return <Current c={controller} />;
  };
  const augmentStep = async () => {
    if (step < steps.length - 1) setStep(step + 1);
    else commitAddFunds();
  };

  const decreaseStep = () => {
    if (step > 0) setStep(step - 1);
    else closeModal();
  };

  const commitAddFunds = async () => {
    setAddingFunds(true);
    const result = await addFundsAction(amountToAdd);
    if (result?.error) {
      toast.custom((t) => <ErrorToast t={t} message={result.error} />);
    } else closeModal();

    setAddingFunds(false);
  };

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={children}>
      <div
        className="flex w-full flex-col items-center gap-12 px-16 py-12"
        ref={parent}
      >
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
          {step > 0 && (
            <FatButton
              buttonType="button"
              text="Back"
              intent="tertiary"
              onClick={decreaseStep}
            />
          )}
          <FatButton
            buttonType="button"
            text={addingFunds ? "Adding funds" : "Proceed"}
            loading={addingFunds}
            intent="primary"
            onClick={augmentStep}
          />
        </div>
      </div>
    </AnimatedPopup>
  );
};

interface StepProps {
  c: ModalController;
}

const AddFundsStep1 = ({ c }: StepProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleValueChange = (value: string) => {
    c.setAmountToAdd(parseFloat(value));
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
        ref={radioRef}
      />
      <AddFundsInput
        className="w-20"
        value={c.amountToAdd}
        ref={inputRef}
        onChange={(e) => {
          handleValueChange(e.target.value);
        }}
        onClick={() => {
          radioRef?.current?.setValueFromRef("Custom");
        }}
      />
    </>
  );
};

const AddFundsStep2 = ({ c }: StepProps) => {
  const getMobilePayLink = (sum: number) =>
    `https://mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=43477&amount=${sum}&comment=Namutalletus&lock=1`;
  return (
    <>
      <h2 className="mt-6 text-4xl font-bold text-neutral-700">
        Scan the QR code
      </h2>
      <QRCodeSVG value={getMobilePayLink(c.amountToAdd)} size={256} />
      <p className="text-2xl ">
        Or manually pay <b>{c.amountToAdd}€</b> to the number <b>43477</b>
      </p>
    </>
  );
};

const AddFundsStep3 = ({ c }: StepProps) => {
  const commitAddFunds = async () => {
    const result = await addFundsAction(c.amountToAdd);
    if (result?.error) {
      toast.custom((t) => <ErrorToast t={t} message={result.error} />);
    } else c.closeModal();
  };

  return (
    <>
      <h2 className="mt-6 text-4xl font-bold text-neutral-700">Add funds</h2>
      <p className="text-2xl ">
        Add <b>{c.amountToAdd}€</b> to your account
      </p>
      <StripeExpressPayment
        amountInCents={c.amountToAdd * 100}
        callback={commitAddFunds}
      />
    </>
  );
};
