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
import { adminResetUserPinAction } from "@/server/actions/admin/resetUserPin";
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

  const [newPin, setNewPin] = useState<string>("");
  const [isResettingPin, setIsResettingPin] = useState(false);

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

  const handleResetPin = async () => {
    setIsResettingPin(true);
    try {
      if (!/^\d{4,10}$/.test(newPin)) {
        throw new Error("PIN must be between 4 and 10 numbers.");
      }

      const result = await adminResetUserPinAction(user.id, newPin);

      if (result.success) {
        toast.success(result.message);
        setNewPin("");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to reset PIN`);
    } finally {
      setIsResettingPin(false);
    }
  };

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={EditUserButton}>
      <div className="no-scrollbar flex flex-col gap-3 overflow-y-auto rounded-xl bg-neutral-50 px-3 pb-3 pt-1 md:px-12 md:pb-12 md:pt-6 portrait:max-h-[80vh] portrait:w-[80vw] landscape:max-h-[80vh] landscape:w-[50vw] ">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-bold text-primary-400 md:text-3xl">
            Manage user
          </p>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-base text-primary-400 md:h-12 md:w-12 md:border-2 md:text-2xl"
            onClick={() => popupRef?.current?.closeContainer()}
          >
            <HiX />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 text-lg text-neutral-500 md:text-xl">
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
          <div className="flex gap-3">
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

        <hr className="border-neutral-200" />

        <div className="flex flex-col gap-4">
          <InputWithLabel
            labelText="Override User PIN"
            placeholder="Enter new 4-10 digit PIN"
            type="text"
            maxLength={10}
            tabIndex={-1}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
          />
          <FatButton
            buttonType="button"
            intent={"primary"}
            text={isResettingPin ? "Resetting..." : "Reset PIN"}
            loading={isResettingPin}
            onClick={() => handleResetPin()}
          />
        </div>
      </div>
    </AnimatedPopup>
  );
};
