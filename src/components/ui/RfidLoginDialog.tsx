"use client";

import { useRef, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { TiWiFi } from "react-icons/ti";

import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { useNfcReader } from "@/state/useNfcReader";
import { animated, useTransition } from "@react-spring/web";

const AnimatedDiv = animated("div");

const steps = [
  {
    title: "Scanning...",
    description: "Place your access card on the back of the device.",
    icon: <TiWiFi />,
  },
  {
    title: "Scan successful",
    description: "Logging in...",
    icon: <IoIosCheckmarkCircleOutline />,
  },
];

export const RfidLoginDialog = () => {
  const [step, setStep] = useState(0);
  const popupRef = useRef<PopupRefActions>(undefined);
  const transitions = useTransition(step, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    exitBeforeEnter: true,
  });

  const reader = useNfcReader();
  const scan = async () => {
    try {
      const tagId = await reader.scanOne();
      augmentStep();
      //rfidLoginAction(tagId);
    } catch (e) {
      console.error("Failed to scan:", e);
      setStep(0);
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
    <AnimatedPopup
      ref={popupRef}
      TriggerComponent={loginButton}
      style="RFIDInstructions"
    >
      <div className="flex flex-col items-center gap-4 px-6 py-5 md:gap-4 md:px-24 md:py-12">
        {transitions((style, step) => (
          <AnimatedDiv
            style={style}
            className="flex w-full items-center justify-center gap-8"
          >
            <span className="text-8xl text-primary-400">
              {steps[step]?.icon}
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-neutral-700">
                {steps[step]?.title}
              </h2>
              <p className="text-xl text-neutral-600">
                {steps[step]?.description}
              </p>
            </div>
          </AnimatedDiv>
        ))}
      </div>
    </AnimatedPopup>
  );
};
