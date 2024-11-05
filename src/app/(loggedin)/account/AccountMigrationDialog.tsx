import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { LineButton } from "@/components/ui/Buttons/LineButton";
import { DialogTitleWithButton } from "@/components/ui/DialogTitleWithButton";
import { MigrationCombobox } from "@/components/ui/MigrationCombobox";
import { migrateAccountAction } from "@/server/actions/account/migration";

export const AccountMigrationDialog = () => {
  const [step, setStep] = useState(0);
  const [result, formAction, isPending] = useActionState(migrateAccountAction, {
    success: false,
    error: undefined,
  });

  useEffect(() => {
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Account migrated successfully!");
      closeModal();
    }
  }, [result]);
  const popupRef = useRef<PopupRefActions>(undefined);
  const closeModal = () => {
    popupRef?.current?.closeContainer();
    setStep(0);
  };

  const setupButton = (
    <LineButton text="Migrate old account" buttonType="button" />
  );

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={setupButton}>
      <div className="flex flex-col items-center gap-4 px-6 py-6 md:gap-12 md:px-16 md:py-12">
        <DialogTitleWithButton
          title="Account migration"
          onButtonClick={closeModal}
        />
        <p className="text-md text-neutral-700 md:text-xl ">
          Have an old Namukilke account you want to migrate? Use the form below
          to move your old account's funds to this one. <br />
        </p>
        <p className="text-md text-red-400 md:text-xl">
          Note that you can only migrate one account.
        </p>
        <form
          action={formAction}
          className="flex flex-col items-center gap-4 md:gap-12"
        >
          <MigrationCombobox />
          <FatButton
            buttonType="button"
            type="submit"
            text="Migrate account"
            intent="primary"
            loading={isPending}
            fullwidth
          />
        </form>
      </div>
    </AnimatedPopup>
  );
};
