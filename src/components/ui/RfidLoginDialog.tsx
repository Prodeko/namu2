"use client";

import { cva } from "class-variance-authority";
import { ReactNode, useEffect, useRef, useState } from "react";

import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { rfidLoginAction } from "@/server/actions/auth/login";
import { useNfcReader } from "@/state/useNfcReader";

import { ThinButton } from "./Buttons/ThinButton";

const steps = [
  {
    title: "Scanning...",
    description:
      "Please place your access card on the NFC reader on the back of the device.",
  },
  { title: "OK", description: "Read successful, logging in..." },
];

export const RfidLoginDialog = () => {
  const [step, setStep] = useState(0);
  const popupRef = useRef<PopupRefActions>();
  const reader = useNfcReader();
  const scan = async () => {
    console.log("scan triggered");
    console.log("reader is", reader);
    try {
      const tagId = await reader.scanOne();
      console.log("successfully scanned:", tagId);
      rfidLoginAction(tagId);
    } catch (e) {
      console.log("Failed to scan:", e);
    }
    //augmentStep();
  };

  const closeModal = () => {
    setStep(0);
    popupRef?.current?.closeContainer();
  };

  const augmentStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else closeModal();
  };
  const decreaseStep = () => {
    if (step > 0) setStep(step - 1);
    else closeModal();
  };

  const loginButton = (
    <FatButton
      buttonType="button"
      text="RFID Login"
      intent="secondary"
      className="flex-1"
      onClick={scan}
    />
  );

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={loginButton}>
      <div className="flex flex-col items-center gap-12 px-12 py-12">
        <h2 className="mt-6 text-4xl font-bold text-neutral-700">
          {steps[step]?.title}
        </h2>

        <p className="text-xl">{steps[step]?.description}</p>
        <p className="text-xl">Reader available: {String(reader.available)}</p>
        <p className="text-xl">Reader scanning: {String(reader.scanning)}</p>
        <FatButton
          buttonType="button"
          text="Cancel"
          intent="tertiary"
          onClick={closeModal}
        />
      </div>
    </AnimatedPopup>
  );
};
