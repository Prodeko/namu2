"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { HiUserAdd } from "react-icons/hi";

import { CreateAccountFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { createAccountAction } from "@/server/actions/account/create";

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <FatButton
      buttonType="button"
      type="submit"
      text={status.pending ? "Creating account..." : "Create account"}
      intent="primary"
      RightIcon={HiUserAdd}
      loading={status.pending}
      fullwidth
    />
  );
};

export const CreateAccountForm = () => {
  const toastIdRef = useRef<string>("");
  const [state, formAction] = useActionState<CreateAccountFormState, FormData>(
    createAccountAction,
    {
      firstName: "",
      lastName: "",
      userName: "",
      pinCode: "",
      confirmPinCode: "",
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
    <form action={formAction} className="flex w-full flex-col gap-6 md:gap-10">
      <div className="flex flex-col gap-4 md:gap-5">
        <InputWithLabel
          labelText="First name"
          placeholder="Matti"
          name="firstName"
          required
        />
        <InputWithLabel
          labelText="Last name"
          placeholder="Meikäläinen"
          name="lastName"
          required
        />
        <InputWithLabel
          labelText="Username"
          placeholder="matti.meikäläinen"
          name="userName"
          required
        />
        <InputWithLabel
          labelText="New PIN (minimum 4 digits)"
          placeholder="1234"
          name="pinCode"
          required
        />
        <InputWithLabel
          labelText="Retype the PIN"
          placeholder="1234"
          name="confirmPinCode"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
};
