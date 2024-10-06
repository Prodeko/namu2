"use client";

import { fail } from "assert";
import { cva } from "class-variance-authority";
import next from "next";
import { NextScript } from "next/document";
import { useRef, useState } from "react";

import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { setNfcLogin } from "@/server/actions/account/setupNfcLogin";
import { useNfcReader } from "@/state/useNfcReader";

import { LineButton } from "./Buttons/LineButton";

const steps = [
  "Please place your access card on the NFC reader on the back of the device.",
  "Scanning...",
  "Successfully registered your access card.",
];

const stepStyles = cva(" ", {
  variants: {
    active: {
      true: "border-primary-400 text-primary-400",
      false: "border-neutral-300 text-neutral-300",
    },
    part: {
      indicator:
        "flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 text-4xl font-bold ",
      line: "h-10 w-10 border-r-2 border-dashed",
    },
  },
});

export const RfidSetupDialog = () => {
  const [step, setStep] = useState(0);
  const popupRef = useRef<PopupRefActions>();
  const reader = useNfcReader();
  const scan = async () => {
    console.log("scan triggered");
    console.log("reader is", reader);
    try {
      const tagId = await reader.scanOne();
      nextStep();
      console.log("successfully scanned:", tagId);
      await setNfcLogin(tagId);
      nextStep();
    } catch (e) {
      //setStep("failure");
      console.log("Failed to scan:", e);
    }
  };

  const closeModal = () => {
    setStep(0);
    popupRef?.current?.closeContainer();
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else closeModal();
  };

  const setupButton = (
    <LineButton text="Connect RFID" buttonType="button" onClick={scan} />
  );

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={setupButton}>
      <div className="flex flex-col items-center gap-12 px-16 py-12">
        <h2 className="mt-6 text-4xl font-bold text-neutral-700">
          Connect an NFC card for quick login!
        </h2>
        <div className="flex flex-col gap-0">
          {steps.map((currStep, index) => (
            <div className="flex flex-col">
              {/* Dashed line */}
              {index !== 0 && (
                <div
                  className={stepStyles({
                    active: index <= step,
                    part: "line",
                  })}
                />
              )}
              <div className="flex w-full items-center gap-9">
                <p
                  className={stepStyles({
                    active: index <= step,
                    part: "indicator",
                  })}
                >
                  {index}
                </p>
                {index <= step && <p className="text-2xl">{currStep}</p>}
              </div>
            </div>
          ))}
        </div>

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
