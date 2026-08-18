"use client";

import { useQRCode } from "next-qrcode";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import { NonEmptyArray } from "@/common/types";
import { getDeviceType } from "@/common/utils";
import { AddFundsInput } from "@/components/ui/AddFundsInput";
import { MobilePayButton } from "@/components/ui/Buttons/MobilePayButton";
import { RadioInput, RadioRefActions } from "@/components/ui/RadioInput";
import { StripeExpressPayment } from "@/components/ui/payment/StripeExpressPayment";
import { addFundsAction } from "@/server/actions/transaction/addFunds";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { createModalFlow } from "../modalSystem";

interface AmountProps {
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
}

const ChooseAmount = ({ amount, setAmount }: AmountProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleValueChange = (value: string) => {
    const newValue = Math.round(parseFloat(value) * 100) / 100;
    setAmount(newValue);
    if (inputRef.current) {
      const newWidth = value === "Custom" ? 1 : newValue.toString().length;
      inputRef.current.style.width = `calc(${newWidth}ch)`;
      if (value === "Custom") {
        inputRef.current.focus();
      }
    }
  };
  const presetOptions: NonEmptyArray<string> = ["5€", "10€", "15€", "Custom"];
  const getDefaultValue = () => {
    const i = presetOptions.indexOf(`${amount}€`);
    return i > -1 ? presetOptions[i] : "Custom";
  };

  const radioRef = useRef<RadioRefActions<string>>(null);
  return (
    <div className="flex w-full flex-col items-center gap-6 md:gap-12">
      <RadioInput
        options={presetOptions}
        style="rounded"
        onChange={handleValueChange}
        defaultValue={getDefaultValue()}
        ref={radioRef}
      />
      <AddFundsInput
        className="w-20"
        value={amount}
        ref={inputRef}
        onChange={(e) => {
          handleValueChange(e.target.value);
        }}
        onClick={() => {
          radioRef?.current?.setValueFromRef("Custom");
        }}
      />
    </div>
  );
};

const ConfirmPayment = ({ amount }: { amount: number }) => {
  const nav = useModalNav<boolean>();
  const getMobilePayDeepLink = `mobilepayfi://send?phone=43477&amount=${amount}&comment=Namutalletus&lock=1`;
  const getMobilePayLink = `https://mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=43477&amount=${amount}&comment=Namutalletus&lock=1`;
  const { Canvas } = useQRCode();
  const [deviceType, setDeviceType] = useState<string>("");
  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);

  const commitStripe = async () => {
    const result = await addFundsAction(amount, "STRIPE");
    if (result?.error) {
      toast.error(result.error);
    } else nav.resolve(true);
  };

  const serviceFee = useMemo(() => {
    if (amount < 30) return 0.25;
    return 0;
  }, [amount]);

  return (
    <div className="flex w-full flex-col items-center gap-6 md:gap-12">
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
            Pay {amount}€ to <b>43477</b> and click <b>proceed</b>
          </p>
        </div>
      )}

      {/*  MobilePay deeplink only available on personal mobile devices */}
      {deviceType === "Mobile" && (
        <div className="flex w-full flex-col items-center gap-2 px-3">
          <MobilePayButton text="MobilePay" href={getMobilePayDeepLink} />
          <p className="text-md text-center md:text-xl">
            Pay {amount}€ to <b>43477</b> and click <b>proceed</b>
          </p>
        </div>
      )}

      {/* Stripe payment not available on guild room tablet */}
      {deviceType !== "GuildroomTablet" && (
        <div className="flex flex-col items-center gap-0">
          <StripeExpressPayment
            amountInCents={(amount + serviceFee) * 100}
            callback={commitStripe}
          />
          <p className="text-md text-center md:text-xl">
            <b>0,25€</b> fee for card payments <b>under 30€</b>
          </p>
        </div>
      )}

      <Modal.Actions>
        <Modal.BackButton text="Back" />
        <Modal.ActionButton
          text="Proceed"
          onClick={async (nav) => {
            const result = await addFundsAction(amount, "MANUAL_MOBILEPAY");
            if (result?.error) {
              toast.error(result.error);
            } else nav.resolve(true);
          }}
        />
      </Modal.Actions>
    </div>
  );
};

const AddFundsFlowContent = () => {
  const [amount, setAmount] = useState(5);

  return (
    <Modal showProgress>
      <Modal.Page id="amount" title="Add Funds" subtitle="Choose amount">
        <ChooseAmount amount={amount} setAmount={setAmount} />
        <Modal.Actions>
          <Modal.NextButton
            text="Proceed"
            onBeforeNext={() => {
              if (amount < 0.01 || Number.isNaN(amount)) {
                toast.error("Amount must be greater than 0.01");
                return false;
              }
              return true;
            }}
          />
        </Modal.Actions>
      </Modal.Page>

      <Modal.Page id="pay" title="Add Funds" subtitle="Confirm payment">
        <ConfirmPayment amount={amount} />
      </Modal.Page>
    </Modal>
  );
};

export const AddFundsFlow = createModalFlow<Record<string, never>, boolean>(
  () => <AddFundsFlowContent />,
);
