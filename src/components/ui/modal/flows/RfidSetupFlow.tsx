"use client";

import { useEffect, useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { RFID_ALLOWED_DEVICE_TYPE, getDeviceType } from "@/common/utils";
import { setNfcLogin } from "@/server/actions/account/setupNfcLogin";
import { useNfcReader } from "@/state/useNfcReader";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { createModalFlow } from "../modalSystem";

type ScanResult = { ok: true } | { ok: false; message: string } | null;

const ScanContent = ({ setResult }: { setResult: (r: ScanResult) => void }) => {
  const nav = useModalNav<boolean>();
  const reader = useNfcReader();

  // biome-ignore lint/correctness/useExhaustiveDependencies: run scan once when this page mounts
  useEffect(() => {
    setResult(null);
    const run = async () => {
      try {
        if (getDeviceType() !== RFID_ALLOWED_DEVICE_TYPE)
          throw new Error(
            "RFID login is only available on the guild room tablet",
          );
        const tagId = await reader.scanOne();
        const error = await setNfcLogin(tagId);
        if (error) throw error;
        setResult({ ok: true });
        nav.next();
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setResult({ ok: false, message });
        nav.goTo("result");
      }
    };
    void run();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-neutral-600">
      <AiOutlineLoading3Quarters
        className="animate-spin text-primary-400"
        size={56}
      />
      <p className="text-lg">
        Place your access card on the NFC reader on the back of the device.
      </p>
    </div>
  );
};

const RfidSetupFlowContent = () => {
  const [result, setResult] = useState<ScanResult>(null);

  const isSuccess = result?.ok === true;
  const errorMessage = result?.ok === false ? result.message : "";
  const resultTitle = result === null ? undefined : isSuccess ? "Connected!" : "Scan failed";

  return (
    <Modal showProgress>
      <Modal.Page id="scanning" title="NFC Connect" dismissible={false}>
        <ScanContent setResult={setResult} />
      </Modal.Page>

      <Modal.Page id="result" title={resultTitle}>
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-8 text-neutral-600">
            <HiCheckCircle className="text-success-500" size={64} />
            <p className="text-center text-lg">
              Successfully registered your access card.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 text-neutral-600">
            <HiXCircle className="text-danger-500" size={64} />
            <p className="text-center text-lg">
              {errorMessage || "Could not read your card. Please try again."}
            </p>
          </div>
        )}
        <Modal.Actions>
          {isSuccess ? (
            <Modal.ActionButton
              text="Done"
              onClick={(nav) => nav.resolve(true)}
            />
          ) : (
            <>
              <Modal.ActionButton
                text="Retry"
                intent="secondary"
                onClick={(nav) => {
                  setResult(null);
                  nav.goTo("scanning");
                }}
              />
              <Modal.CloseButton intent="tertiary" />
            </>
          )}
        </Modal.Actions>
      </Modal.Page>
    </Modal>
  );
};

export const RfidSetupFlow = createModalFlow<Record<string, never>, boolean>(
  () => <RfidSetupFlowContent />,
);
