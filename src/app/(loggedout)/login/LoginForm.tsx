"use client";

import { useFormState } from "react-dom";
import { HiLogin } from "react-icons/hi";

import { LoginFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { loginAction } from "@/server/actions/auth/login";

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
    <form action={formAction} className="flex w-full flex-col gap-6">
      <InputWithLabel
        uniqueId="login-namu-id"
        labelText="Namu ID"
        placeholderText={"Namu Käyttäjä"}
        name="userName"
        required
      />
      <InputWithLabel
        uniqueId="login-pin-code"
        labelText="Pin Code"
        type="number"
        placeholderText={"1234"}
        name="pinCode"
        required
      />
      <FatButton
        buttonType="button"
        type="submit"
        text="Login"
        intent="primary"
        RightIcon={HiLogin}
      />
    </form>
  );
};
