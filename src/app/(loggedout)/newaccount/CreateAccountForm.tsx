"use client";

import { useFormState } from "react-dom";
import { HiUserAdd } from "react-icons/hi";

import { CreateAccountFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Input } from "@/components/ui/Input";
import { createAccountAction } from "@/server/actions/account/create";

export const CreateAccountForm = () => {
  const [state, formAction] = useFormState<CreateAccountFormState, FormData>(
    createAccountAction,
    {
      firstName: "",
      lastName: "",
      userName: "",
      pinCode: "",
      confirmPinCode: "",
    },
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-5">
        <Input
          labelText="First name"
          placeholderText="Matti"
          name="firstName"
          required
        />
        <Input
          labelText="Last name"
          placeholderText="Meikäläinen"
          name="lastName"
          required
        />
        <Input
          labelText="Username"
          placeholderText="matti.meikäläinen"
          name="userName"
          required
        />
        <Input
          labelText="New PIN (minimum 4 digits)"
          placeholderText="1234"
          name="pinCode"
          required
        />
        <Input
          labelText="Retype the PIN"
          placeholderText="1234"
          name="confirmPinCode"
          required
        />
      </div>
      <FatButton
        buttonType="button"
        type="submit"
        text="Create account"
        intent="primary"
        RightIcon={HiUserAdd}
        fullwidth
      />
    </form>
  );
};
