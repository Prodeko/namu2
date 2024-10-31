"use client";

import { cva } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { HiX } from "react-icons/hi";

import { RFID_ALLOWED_DEVICE_TYPE, getDeviceType } from "@/common/utils";
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
    state: {
      active: "border-primary-400 text-primary-400",
      inactive: "border-neutral-300 text-neutral-300",
      error: "border-danger-600 text-danger-600",
    },

    part: {
      indicator:
        "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 text-xl font-bold md:h-16 md:w-16 md:text-3xl ",
      line: "h-8 w-6 border-r-2 border-dashed",
    },
  },
});

export const RfidSetupDialog = () => {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const popupRef = useRef<PopupRefActions>(undefined);
  const reader = useNfcReader();

  const [deviceType, setDeviceType] = useState("");
  useEffect(() => {
    // Getdevicetype references navigator which is not defined before page load
    setDeviceType(getDeviceType());
  }, []);

  const scan = async () => {
    try {
      if (deviceType !== RFID_ALLOWED_DEVICE_TYPE)
        throw new Error(
          "RFID login is only available on the guild room tablet",
        );
      const tagId = await reader.scanOne();
      setStep((s) => s + 1);
      await setNfcLogin(tagId);
      setStep((s) => s + 1);
    } catch (e) {
      setError(String(e));
      console.error("Failed to scan:", e);
    }
  };

  const retryScan = () => {
    setError("");
    setStep(0);
    scan();
  };

  const closeModal = () => {
    setError("");
    popupRef?.current?.closeContainer();
    setStep(0);
  };

  const setupButton = (
    <LineButton text="Connect RFID" buttonType="button" onClick={scan} />
  );

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={setupButton}>
      <div className="flex flex-col items-center gap-4 px-6 py-6 md:gap-12 md:px-16 md:py-12">
        <div className="-mb-6 flex w-full items-center justify-between md:-mb-12">
          <p className="text-lg font-bold text-primary-400 md:text-3xl">
            NFC Connect
          </p>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex  h-10 w-10 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-2xl text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl"
            onClick={closeModal}
          >
            <HiX />
          </div>
        </div>
        <h2 className="mt-6 text-lg font-bold text-neutral-700 md:text-4xl">
          Connect an NFC card for quick login!
        </h2>
        <div className="flex w-full flex-col gap-0">
          {steps.map((currStep, index) => (
            <div className="flex flex-col" key={currStep}>
              {/* Dashed line */}
              {index !== 0 && (
                <div
                  className={stepStyles({
                    state: index <= step ? "active" : "inactive",
                    part: "line",
                  })}
                />
              )}
              <div className="flex w-full items-center gap-9">
                <p
                  className={stepStyles({
                    state:
                      error && index === step
                        ? "error"
                        : index <= step
                          ? "active"
                          : "inactive",
                    part: "indicator",
                  })}
                >
                  {error !== "" && index === step ? <HiX /> : index + 1}
                </p>
                {index <= step && (
                  <p className="text-md md:text-2xl">
                    {error && index === step ? error : currStep}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-md md:text-xl">
          Reader available: {String(reader.available)}, scanning:{" "}
          {String(reader.scanning)}
        </p>
        <div className="flex gap-6">
          {error && (
            <FatButton
              buttonType="button"
              text="Retry"
              intent="secondary"
              onClick={retryScan}
            />
          )}
          <FatButton
            buttonType="button"
            text="Close"
            intent="primary"
            onClick={closeModal}
          />
        </div>
      </div>
    </AnimatedPopup>
  );
};
