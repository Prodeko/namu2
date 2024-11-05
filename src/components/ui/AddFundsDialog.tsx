"use client";

import { useQRCode } from "next-qrcode";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast, { Toast } from "react-hot-toast";
import { HiX } from "react-icons/hi";

import { NonEmptyArray } from "@/common/types";
import { getDeviceType } from "@/common/utils";
import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { RadioInput, RadioRefActions } from "@/components/ui/RadioInput";
import { addFundsAction } from "@/server/actions/transaction/addFunds";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { AddFundsInput } from "./AddFundsInput";
import { MobilePayButton } from "./Buttons/MobilePayButton";
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

const StepTitle = ({ text }: { text: string }) => (
  <h2 className="mt-6 text-2xl font-bold text-neutral-700 md:text-4xl">
    {text}
  </h2>
);

export const AddFundsDialog = ({ children }: Props) => {
  const [amountToAdd, setAmountToAdd] = useState(5);
  const [step, setStep] = useState(0);
  const [addingFunds, setAddingFunds] = useState(false);
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  const steps = [AddFundsStep1, AddFundsStep2];
  const popupRef = useRef<PopupRefActions>(undefined);

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
    if (amountToAdd < 0.01) {
      toast.error("Amount must be greater than 0.01");
      return;
    }
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
      toast.error(result.error);
    } else closeModal();

    setAddingFunds(false);
  };

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={children}>
      <div
        className="flex w-full flex-col items-center gap-6 px-5 py-6 md:gap-12 md:px-16 md:py-12"
        ref={parent}
      >
        <div className="-mb-6 flex w-full items-center justify-between md:-mb-12">
          <p className="text-xl font-bold text-primary-400 md:text-3xl">
            Add Funds
          </p>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-lg text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl"
            onClick={closeModal}
          >
            <HiX />
          </div>
        </div>

        {currentStep()}
        <div className="mt-2 flex w-full gap-3 md:gap-6">
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
            text={addingFunds ? "Adding..." : "Proceed"}
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
    const newValue = parseFloat(value);
    c.setAmountToAdd(newValue);
    if (inputRef.current) {
      const newWidth = value === "Custom" ? 1 : value.length;
      inputRef.current.style.width = `calc(${newWidth}ch - calc(${newWidth} * 0.15rem))`;
      if (value === "Custom") {
        inputRef.current.focus();
      }
    }
  };
  const presetOptions: NonEmptyArray<string> = ["5€", "10€", "15€", "Custom"];
  const getDefaultValue = () => {
    const i = presetOptions.indexOf(`${c.amountToAdd}€`);
    return i > -1 ? presetOptions[i] : "Custom";
  };

  const radioRef = useRef<RadioRefActions<string>>(null);
  return (
    <>
      <StepTitle text="Choose amount" />
      <RadioInput
        options={presetOptions}
        style="rounded"
        onChange={handleValueChange}
        defaultValue={getDefaultValue()}
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
  const getMobilePayDeepLink = `mobilepayfi://send?phone=43477&amount=${c.amountToAdd}&comment=Namutalletus&lock=1`;
  const getMobilePayLink = `https://mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=43477&amount=${c.amountToAdd}&comment=Namutalletus&lock=1`;
  const { Canvas } = useQRCode();
  const [deviceType, setDeviceType] = useState<string>("");
  useEffect(() => {
    getDeviceType().then((device) => setDeviceType(device));
  }, []);

  const commitAddFunds = async () => {
    const result = await addFundsAction(c.amountToAdd);
    if (result?.error) {
      toast.error(result.error);
    } else c.closeModal();
  };
  const serviceFee = useMemo(() => {
    if (c.amountToAdd < 30) return 0.25;
    return 0;
  }, [c.amountToAdd]);

  return (
    <>
      <StepTitle text="Confirm payment" />
      {deviceType !== "Mobile" && (
        <div className="flex flex-col items-center gap-2">
          <Canvas
            text={getMobilePayLink}
            options={{
              color: {
                dark: "#303030FF",
                light: "#00000000",
              },
            }}
          />
          <p className="text-md text-center md:text-xl">
            Pay {c.amountToAdd}€ to <b>43477</b> and click <b>proceed</b>
          </p>
        </div>
      )}

      {/*  MobilePay deeplink only available on personal mobile devices */}
      {deviceType === "Mobile" && (
        <div className="flex w-full flex-col items-center gap-2 px-3">
          <MobilePayButton text="MobilePay" href={getMobilePayDeepLink} />
          <p className="text-md text-center md:text-xl">
            Pay {c.amountToAdd}€ to <b>43477</b> and click <b>proceed</b>
          </p>
        </div>
      )}

      {/* Stripe payment not available on guild room tablet */}
      {deviceType !== "GuildroomTablet" && (
        <div className="flex flex-col items-center gap-0">
          <StripeExpressPayment
            amountInCents={(c.amountToAdd + serviceFee) * 100}
            callback={commitAddFunds}
          />
          <p className="text-md text-center md:text-xl">
            <b>0,25€</b> fee for card payments <b>under 30€</b>
          </p>
        </div>
      )}
    </>
  );
};
