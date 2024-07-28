"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
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
  const toastIdRef = useRef<string>();
  const [state, formAction] = useFormState<ChangePinFormState, FormData>(
    changePincodeAction,
    {
      oldPincode: "",
      newPincode: "",
      confirmNewPincode: "",
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
