"use client";

import { useFormState } from "react-dom";
import { HiSave } from "react-icons/hi";

import { ChangePinFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { changePincodeAction } from "@/server/actions/account/changePincode";

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
    <form action={formAction} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
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
      <FatButton
        text="Save Pincode"
        RightIcon={HiSave}
        buttonType="button"
        type="submit"
        intent="primary"
        fullwidth
      />
    </form>
  );
};
