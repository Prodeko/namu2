"use client";

import { useFormState } from "react-dom";
import { HiUserAdd } from "react-icons/hi";

import { CreateAccountFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
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
