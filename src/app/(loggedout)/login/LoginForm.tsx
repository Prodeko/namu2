"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { HiLogin } from "react-icons/hi";

import { LoginFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { RfidLoginDialog } from "@/components/ui/RfidLoginDialog";
import { loginAction } from "@/server/actions/auth/login";

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <FatButton
      buttonType="button"
      type="submit"
      text={status.pending ? "Logging in..." : "Login"}
      intent="primary"
      RightIcon={HiLogin}
      loading={status.pending}
      className="w-full"
      fullwidth
    />
  );
};

export const LoginForm = () => {
  const toastIdRef = useRef<string>();
  const [state, formAction] = useFormState<LoginFormState, FormData>(
    loginAction,
    {
      userName: "",
      pinCode: "",
      message: "",
    },
  );

  useEffect(() => {
    if (state.message) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      const newToastId = toast.error(state.message);
      toastIdRef.current = newToastId;
    }
  }, [state]);

  return (
    <form action={formAction} className="flex w-full flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-5">
        <InputWithLabel
          labelText="Namu ID"
          placeholder={"Namu Käyttäjä"}
          name="userName"
          required
        />
        <InputWithLabel
          labelText="Pin Code"
          type="number"
          placeholder={"1234"}
          name="pinCode"
          required
        />
      </div>
      <div className="flex w-full gap-4">
        <RfidLoginDialog />
        <SubmitButton />
      </div>
    </form>
  );
};
