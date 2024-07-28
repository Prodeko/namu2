"use client";

import { useFormState, useFormStatus } from "react-dom";
import { HiLogin } from "react-icons/hi";

import { LoginFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
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
      fullwidth
    />
  );
};

export const LoginForm = () => {
  const [state, formAction] = useFormState<LoginFormState, FormData>(
    loginAction,
    {
      userName: "",
      pinCode: "",
      message: "",
    },
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-10">
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
      <SubmitButton />
    </form>
  );
};
