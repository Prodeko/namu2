"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiLogin } from "react-icons/hi";

import { LoginFormState } from "@/common/types";
import { RFID_ALLOWED_DEVICE_TYPE, getDeviceType } from "@/common/utils";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { RfidLoginDialog } from "@/components/ui/RfidLoginDialog";
import { loginAction } from "@/server/actions/auth/login";
import { useShoppingCart } from "@/state/useShoppingCart";

export const LoginForm = () => {
  const toastIdRef = useRef<string>("");
  const [state, formAction, isPending] = useActionState<
    LoginFormState,
    FormData
  >(loginAction, {
    userName: "",
    pinCode: "",
    message: "",
  });

  const { clearCart } = useShoppingCart();
  const [deviceType, setDeviceType] = useState<string>("");
  useEffect(() => {
    clearCart();
    // Getdevicetype references navigator which is not defined before page load
    getDeviceType().then((device) => setDeviceType(device));
  }, [clearCart]);

  useEffect(() => {
    if (state.message) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      const newToastId = toast.error(state.message);
      toastIdRef.current = newToastId;
    }
  }, [state]);

  const SubmitButton = () => {
    return (
      <FatButton
        buttonType="button"
        type="submit"
        text={isPending ? "Logging in..." : "Login"}
        intent="primary"
        RightIcon={HiLogin}
        loading={isPending}
        className="w-full"
        fullwidth
      />
    );
  };

  return (
    <form action={formAction} className="flex w-full flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-5">
        <InputWithLabel
          labelText="Namu ID"
          placeholder={"Namu Käyttäjä"}
          name="userName"
          autoCapitalize="none"
          spellCheck="false"
          defaultValue={state.userName}
          required
        />
        <InputWithLabel
          labelText="Pin Code"
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={"1234"}
          name="pinCode"
          defaultValue={state.pinCode}
          required
        />
      </div>
      <div className="flex w-full gap-4">
        {deviceType === RFID_ALLOWED_DEVICE_TYPE && <RfidLoginDialog />}
        <SubmitButton />
      </div>
    </form>
  );
};
