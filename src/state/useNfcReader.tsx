"use client";

import { useState } from "react";

export const useNfcReader = () => {
  const [available, setAvailable] = useState(false);
  let controller = new AbortController();
  let scanOne: () => Promise<NDEFReadingEvent> | Promise<void> = async () => {};

  const stopScan = () => {
    controller.abort();
    controller = new AbortController();
  };

  try {
    const ndef = new NDEFReader();
    scanOne = async () => {
      return new Promise<NDEFReadingEvent>((resolve, reject) => {
        ndef.onreading = (event) => {
          stopScan();
          resolve(event);
        };
        ndef.onreadingerror = (event) => {
          stopScan();
          reject(event);
        };
        // A tag should be read within 15 seconds, else the scan will be aborted
        setTimeout(
          () => {
            stopScan();
            reject("Didn't read a tag on time");
          },
          15000,
          controller.signal,
        );
        ndef.scan({ signal: controller.signal });
      });
    };
  } catch (e) {
    // Failed to initialize NDEFReader
    // Likely means that the user is on a device that doesn't support NFC
    setAvailable(false);
  }
  return { available, scanOne };
};
