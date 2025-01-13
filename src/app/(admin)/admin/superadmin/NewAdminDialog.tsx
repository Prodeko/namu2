"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiPlus, HiX } from "react-icons/hi";

import { ClientUser } from "@/common/types";
import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { changeUserRole } from "@/server/actions/admin/changeRole";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Role, User } from "@prisma/client";

interface Props {
  users: ClientUser[];
}

const AddAdminButton = (
  <FatButton
    buttonType="button"
    intent="primary"
    RightIcon={HiPlus}
    text="Add new admin"
    className="w-full max-w-[25rem]"
  />
);

export const NewAdminDialog = ({ users }: Props) => {
  const [userFilter, setUserFilter] = useState<string>("");
  const filteredNonAdminUsers = users.filter((user) => {
    const isNotAdmin = user.role !== "ADMIN" && user.role !== "SUPERADMIN";
    const nameData = `${user.firstName} ${user.lastName} ${user.userName}`;
    const isMatching = nameData
      .toLowerCase()
      .includes(userFilter.toLowerCase());
    return isNotAdmin && isMatching;
  });
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  const popupRef = useRef<PopupRefActions>(undefined);

  const changeRole = async (user: ClientUser, role: Role) => {
    try {
      await changeUserRole(user.id, role);
      toast.success("User role changed successfully");
    } catch (error) {
      toast.error(`Failed to change user role: ${error}`);
    }
  };

  return (
    <AnimatedPopup ref={popupRef} TriggerComponent={AddAdminButton}>
      <div className="no-scrollbar flex flex-col gap-6 overflow-hidden rounded-xl bg-neutral-50 px-3 py-6 md:px-12 md:py-12 portrait:h-[80vh] portrait:w-[80vw] landscape:h-[80vh] landscape:w-[50vw] ">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-bold text-primary-400 md:text-3xl">
            Add administrator
          </p>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-lg text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl"
            onClick={() => popupRef?.current?.closeContainer()}
          >
            <HiX />
          </div>
        </div>
        <InputWithLabel
          labelText="Search for user"
          placeholder="Search by name or username..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value.toLowerCase())}
        />
        <div
          ref={parent}
          className="no-scrollbar flex-col divide-y-2 divide-neutral-200 overflow-y-scroll"
        >
          {filteredNonAdminUsers.map((user) => (
            <div
              key={user.id}
              className="flex w-full items-center justify-between  py-5 text-lg text-neutral-700 md:text-xl"
            >
              <div>
                <span className="text-xl font-medium md:text-2xl">
                  {user.firstName} {user.lastName}
                </span>{" "}
                ({user.userName})
              </div>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <div
                onClick={() => changeRole(user, "ADMIN")}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 text-primary-400 "
              >
                <HiPlus />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedPopup>
  );
};
