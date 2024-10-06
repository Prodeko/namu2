"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useNfcReader = () => {
  const [available, setAvailable] = useState(false);
  const [scanning, setScanning] = useState(false);
  const controllerRef = useRef(new AbortController());
  const ndefRef = useRef<NDEFReader | null>(null);

  useEffect(() => {
    try {
      ndefRef.current = new NDEFReader();
      setAvailable(true);
    } catch (e) {
      // Device doesn't support NFC
      setAvailable(false);
    }
    return () => {
      stopScan();
    };
  }, []);

  const stopScan = useCallback(() => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
    setScanning(false);
  }, []);

  const scanOne = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      stopScan(); // Stop previous scan
      const ndef = ndefRef.current;
      if (!ndef) {
        //reject(new Error("NDEFReader not available"));
        resolve("Debug ID");
        return;
      }

      ndef.onreading = (event) => {
        stopScan();
        resolve(event.serialNumber);
      };
      ndef.onreadingerror = (event) => {
        stopScan();
        reject(event);
      };

      // A tag should be read within 15 seconds, else the scan will be aborted
      setTimeout(() => {
        stopScan();
        reject(new Error("Didn't read a tag on time"));
      }, 15000);

      ndef.scan({ signal: controllerRef.current.signal }).catch((error) => {
        stopScan();
        reject(error);
      });
      setScanning(true);
    });
  }, [stopScan]);

  // Memoize the return object to maintain referential equality
  const returnValue = useMemo(
    () => ({ available, scanOne, scanning }),
    [available, scanOne, scanning],
  );

  return returnValue;
};
