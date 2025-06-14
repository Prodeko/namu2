"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiUser, HiUserAdd } from "react-icons/hi";

import { CreateAccountFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { MigrationCombobox } from "@/components/ui/MigrationCombobox";
import { createAccountAction } from "@/server/actions/account/create";

export const CreateAccountForm = () => {
  const toastIdRef = useRef<string>("");
  const [hasOldAccount, setHasOldAccount] = useState(false);
  const [state, formAction, isPending] = useActionState<
    CreateAccountFormState,
    FormData
  >(createAccountAction, {
    firstName: "",
    lastName: "",
    userName: "",
    pinCode: "",
    confirmPinCode: "",
    message: "",
    legacyAccountId: undefined,
  });

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
        text={isPending ? "Creating account..." : "Create account"}
        intent="primary"
        RightIcon={HiUserAdd}
        loading={isPending}
        fullwidth
      />
    );
  };

  return (
    <form action={formAction} className="flex w-full flex-col gap-6 md:gap-10">
      <div className="flex flex-col items-center gap-4 md:gap-5">
        <InputWithLabel
          labelText="First name"
          placeholder="Matti"
          name="firstName"
          defaultValue={state.firstName}
          required
        />
        <InputWithLabel
          labelText="Last name"
          placeholder="Meikäläinen"
          name="lastName"
          defaultValue={state.lastName}
          required
        />
        <InputWithLabel
          labelText="Username"
          placeholder="matti.meikäläinen"
          autoCapitalize="none"
          spellCheck="false"
          name="userName"
          defaultValue={state.userName}
          required
        />
        <div className="grid w-full grid-cols-2 gap-2">
          <InputWithLabel
            labelText="New PIN"
            placeholder="1234"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            name="pinCode"
            defaultValue={state.pinCode}
            required
          />
          <InputWithLabel
            labelText="Retype PIN"
            placeholder="1234"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            name="confirmPinCode"
            defaultValue={state.confirmPinCode}
            required
          />
        </div>
        {!hasOldAccount && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            className="text-bold flex items-center gap-2 py-2 text-lg text-primary-400 underline md:text-2xl lg:text-xl"
            onClick={() => setHasOldAccount(true)}
          >
            <p>Migrate old account</p>
            <HiUser className="inline" />
          </div>
        )}

        {hasOldAccount && <MigrationCombobox />}
      </div>
      <SubmitButton />
    </form>
  );
};
