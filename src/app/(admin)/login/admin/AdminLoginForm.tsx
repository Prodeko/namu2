"use client";

import { useActionState } from "react";
import { HiLogin } from "react-icons/hi";

import { LoginFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { adminLoginAction } from "@/server/actions/auth/adminLogin";

export const AdminLoginForm = () => {
  const [state, formAction, isPending] = useActionState<
    LoginFormState,
    FormData
  >(adminLoginAction, {
    userName: "",
    pinCode: "",
    message: "",
  });

  return (
    <form action={formAction} className="flex w-full flex-col gap-6">
      <InputWithLabel
        labelText="Namu ID"
        placeholder={"Namu Admin"}
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
      <FatButton
        buttonType="button"
        type="submit"
        text="Login"
        intent="primary"
        loading={isPending}
        RightIcon={HiLogin}
      />
    </form>
  );
};
