"use client";

import { format } from "date-fns";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiPencil, HiPlus, HiX } from "react-icons/hi";

import { ClientUser } from "@/common/types";
import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { InputWithLabel } from "@/components/ui/Input";
import { adminAddFundsAction } from "@/server/actions/transaction/addFunds";
import { Role, User } from "@prisma/client";

interface Props {
  user: ClientUser;
}

const EditUserButton = (
  <IconButton buttonType="button" Icon={HiPencil} sizing="xs" />
);

export const ManageUserDialog = ({ user }: Props) => {
  const [modifyBalanceAmount, setModifyBalanceAmount] = useState<number | "">(
    "",
  );

  const popupRef = useRef<PopupRefActions>(undefined);

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
    <AnimatedPopup ref={popupRef} TriggerComponent={EditUserButton}>
      <div className="no-scrollbar flex flex-col gap-6 overflow-hidden rounded-xl bg-neutral-50 px-3 py-6 md:px-12 md:py-12 portrait:max-h-[80vh] portrait:w-[80vw] landscape:max-h-[80vh] landscape:w-[50vw] ">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-bold text-primary-400 md:text-3xl">
            Manage user
          </p>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-lg text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl"
            onClick={() => popupRef?.current?.closeContainer()}
          >
            <HiX />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 text-lg text-neutral-500 md:text-xl">
          <span className="text-xl font-medium text-neutral-700 md:text-2xl">
            {user.firstName} {user.lastName}
          </span>{" "}
          <div className="">Username: {user.userName}</div>
          <div className="">Role: {user.role}</div>
          <div className="">
            Created: {format(user.createdAt, "dd.MM.yyyy")}
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
    </AnimatedPopup>
  );
};
