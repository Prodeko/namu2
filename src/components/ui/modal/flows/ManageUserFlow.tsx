"use client";

import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

import { ClientUser } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { adminAddFundsAction } from "@/server/actions/transaction/addFunds";

import { Modal } from "../Modal";
import { createModalFlow } from "../modalSystem";

const ManageUserContent = ({ user }: { user: ClientUser }) => {
  const [modifyBalanceAmount, setModifyBalanceAmount] = useState<number | "">(
    "",
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.round(parseFloat(e.target.value) * 100) / 100;
    if (!Number.isNaN(value)) {
      setModifyBalanceAmount(value);
    } else {
      setModifyBalanceAmount("");
    }
  };

  const addToBalance = async () => {
    try {
      if (modifyBalanceAmount === "" || modifyBalanceAmount === 0)
        throw new Error("Please enter a valid amount");
      await adminAddFundsAction(modifyBalanceAmount, user.id);
      toast.success("Balance added successfully");
    } catch (error) {
      toast.error(`Failed to add balance: ${error}`);
    }
    setModifyBalanceAmount("");
  };

  const removeFromBalance = async () => {
    try {
      if (modifyBalanceAmount === "" || modifyBalanceAmount === 0)
        throw new Error("Please enter a valid amount");
      await adminAddFundsAction(-modifyBalanceAmount, user.id);
      toast.success("Balance removed successfully");
    } catch (error) {
      toast.error(`Failed to remove balance: ${error}`);
    }
    setModifyBalanceAmount("");
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
            onClick={() => removeFromBalance()}
          />
          <FatButton
            buttonType="button"
            intent={"primary"}
            text="Add"
            onClick={() => addToBalance()}
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
