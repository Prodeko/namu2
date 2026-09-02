"use client";

import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ClientUser } from "@/common/types";
import { formatCurrency } from "@/common/utils";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { getUserBalanceAction } from "@/server/actions/admin/getUserBalance";
import { adminAddFundsAction } from "@/server/actions/transaction/addFunds";

import { Modal } from "../Modal";
import { createModalFlow } from "../modalSystem";

const ManageUserContent = ({ user }: { user: ClientUser }) => {
  const [modifyBalanceAmount, setModifyBalanceAmount] = useState<number | "">(
    "",
  );
  const [balance, setBalance] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    const result = await getUserBalanceAction(user.id);
    if (result.ok) {
      setBalance(formatCurrency(result.balance));
    } else {
      setBalance(null);
      toast.error(`Failed to read balance: ${result.error}`);
    }
  }, [user.id]);

  useEffect(() => {
    void refreshBalance();
  }, [refreshBalance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.round(parseFloat(e.target.value) * 100) / 100;
    if (!Number.isNaN(value)) {
      setModifyBalanceAmount(value);
    } else {
      setModifyBalanceAmount("");
    }
  };

  /**
   * `sign` is +1 to add and -1 to remove. The action reports failures by
   * returning `{ error }` rather than throwing, so both have to be handled.
   */
  const modifyBalance = async (sign: 1 | -1) => {
    const verb = sign === 1 ? "add" : "remove";
    try {
      if (modifyBalanceAmount === "" || modifyBalanceAmount === 0)
        throw new Error("Please enter a valid amount");
      const result = await adminAddFundsAction(
        sign * modifyBalanceAmount,
        user.id,
      );
      if (result?.error) throw new Error(result.error);
      toast.success(`Balance ${verb}ed successfully`);
      setModifyBalanceAmount("");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to ${verb} balance: ${message}`);
    }
    // Re-read either way: a failed write leaves the shown balance correct.
    await refreshBalance();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-col gap-4 text-lg text-neutral-500 md:text-xl">
        <span className="text-xl font-medium text-neutral-700 md:text-2xl">
          {user.firstName} {user.lastName}
        </span>{" "}
        <div className="">Username: {user.userName}</div>
        <div className="">Role: {user.role}</div>
        <div className="">Created: {format(user.createdAt, "dd.MM.yyyy")}</div>
        <div className="">
          Balance:{" "}
          <span className="font-medium text-neutral-700">
            {balance ?? "loading..."}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <InputWithLabel
          labelText="Add or remove from balance"
          placeholder="Amount to add/remove"
          type="number"
          tabIndex={-1}
          value={modifyBalanceAmount}
          onChange={handleInputChange}
        />
        <div className="flex gap-4">
          <FatButton
            buttonType="button"
            intent={"secondary"}
            text="Remove"
            onClick={() => void modifyBalance(-1)}
          />
          <FatButton
            buttonType="button"
            intent={"primary"}
            text="Add"
            onClick={() => void modifyBalance(1)}
          />
        </div>
      </div>
    </div>
  );
};

export const ManageUserFlow = createModalFlow<{ user: ClientUser }>(
  ({ user }) => (
    <Modal>
      <Modal.Page title="Manage user">
        <ManageUserContent user={user} />
      </Modal.Page>
    </Modal>
  ),
);
