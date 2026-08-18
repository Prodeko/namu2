"use client";

import { useEffect } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { TiWiFi } from "react-icons/ti";
import { HiX } from "react-icons/hi";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { RFID_ALLOWED_DEVICE_TYPE } from "@/common/utils";
import { useNfcReader } from "@/state/useNfcReader";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { createModalFlow } from "../modalSystem";

const ScanContent = () => {
  const nav = useModalNav<void>();
  const router = useRouter();
  const reader = useNfcReader();

  // biome-ignore lint/correctness/useExhaustiveDependencies: run scan once when this page mounts
  useEffect(() => {
    const run = async () => {
      try {
        const tagId = await reader.scanOne();
        nav.next();
        const result = await signIn("rfid", {
          redirect: false,
          rfidTagId: tagId,
          deviceType: RFID_ALLOWED_DEVICE_TYPE,
        });
        if (result?.error) throw new Error(result.error);
        router.push("/shop");
        router.refresh();
      } catch {
        nav.goTo("error");
      }
    };
    void run();
  }, []);

  return (
    <div className="flex w-full items-center justify-center gap-8 py-8">
      <span className="text-8xl text-primary-400">
        <TiWiFi />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-neutral-700">Scanning...</h2>
        <p className="text-xl text-neutral-600">
          Place your access card on the back of the device.
        </p>
      </div>
    </div>
  );
};

const SuccessContent = () => (
  <div className="flex w-full items-center justify-center gap-8 py-8">
    <span className="text-8xl text-primary-400">
      <IoIosCheckmarkCircleOutline />
    </span>
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl font-bold text-neutral-700">Scan successful</h2>
      <p className="text-xl text-neutral-600">Logging in...</p>
    </div>
  </div>
);

const ErrorContent = () => {
  const nav = useModalNav<void>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: auto-close after error display
  useEffect(() => {
    const t = setTimeout(() => nav.close(), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex w-full items-center justify-center gap-8 py-8">
      <span className="text-8xl text-red-400">
        <HiX />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-neutral-700">Error</h2>
        <p className="text-xl text-neutral-600">Please try again.</p>
      </div>
    </div>
  );
};

export const RfidLoginFlow = createModalFlow<Record<string, never>, void>(() => (
  <Modal>
    <Modal.Page id="scanning" dismissible={false}>
      <ScanContent />
    </Modal.Page>

    <Modal.Page id="success">
      <SuccessContent />
    </Modal.Page>

    <Modal.Page id="error">
      <ErrorContent />
    </Modal.Page>
  </Modal>
));
