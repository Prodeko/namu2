"use client";

import { useFormState, useFormStatus } from "react-dom";
import { HiSave } from "react-icons/hi";

import { ChangePinFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { changePincodeAction } from "@/server/actions/account/changePincode";

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <FatButton
      buttonType="button"
      type="submit"
      text={status.pending ? "Changing Pincode..." : "Change Pincode"}
      intent="primary"
      RightIcon={HiSave}
      loading={status.pending}
      fullwidth
    />
  );
};

export const ChangePinForm = () => {
  const [state, formAction] = useFormState<ChangePinFormState, FormData>(
    changePincodeAction,
    {
      oldPincode: "",
      newPincode: "",
      confirmNewPincode: "",
    },
  );
  return (
    <form action={formAction} className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <InputWithLabel
          labelText="Old PIN code"
          name="oldPincode"
          placeholder="1234"
          required
        />
        <InputWithLabel
          labelText="New PIN code"
          name="newPincode"
          placeholder="4321"
          required
        />
        <InputWithLabel
          labelText="Confirm PIN code"
          name="confirmNewPincode"
          placeholder="4321"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
};
