"use client";

import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { MigrationCombobox } from "@/components/ui/MigrationCombobox";
import { migrateAccountAction } from "@/server/actions/account/migration";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { createModalFlow } from "../modalSystem";

const AccountMigrationContent = () => {
  const nav = useModalNav<boolean>();
  const [result, formAction, isPending] = useActionState(migrateAccountAction, {
    success: false,
    error: undefined,
  });

  useEffect(() => {
    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Account migrated successfully!");
      nav.resolve(true);
    }
  }, [result]);

  return (
    <>
      <p className="text-md text-neutral-700 md:text-xl">
        Have an old Namukilke account you want to migrate? Use the form below to
        move your old account&apos;s funds to this one.
      </p>
      <p className="text-md mt-2 text-red-400 md:text-xl">
        Note that you can only migrate one account.
      </p>
      <form
        action={formAction}
        className="mt-6 flex flex-col items-center gap-4 md:gap-12"
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
    </>
  );
};

export const AccountMigrationFlow = createModalFlow<
  Record<string, never>,
  boolean
>(() => (
  <Modal>
    <Modal.Page title="Account migration">
      <AccountMigrationContent />
    </Modal.Page>
  </Modal>
));
