"use client";

import { useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { HiSave } from "react-icons/hi";

import { ChangePinFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { changePincodeAction } from "@/server/actions/account/changePincode";

export const ChangePinForm = () => {
  const toastIdRef = useRef<string>("");
  const [state, formAction, isPending] = useActionState<
    ChangePinFormState,
    FormData
  >(changePincodeAction, {
    oldPincode: "",
    newPincode: "",
    confirmNewPincode: "",
    message: "",
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
        text={isPending ? "Changing Pincode..." : "Change Pincode"}
        intent="primary"
        RightIcon={HiSave}
        loading={isPending}
        fullwidth
      />
    );
  };

  return (
    <form action={formAction} className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <InputWithLabel
          labelText="Old PIN code"
          name="oldPincode"
          placeholder="1234"
          type="password"
          required
        />
        <InputWithLabel
          labelText="New PIN code"
          name="newPincode"
          placeholder="4321"
          type="password"
          required
        />
        <InputWithLabel
          labelText="Confirm PIN code"
          name="confirmNewPincode"
          placeholder="4321"
          type="password"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
};
