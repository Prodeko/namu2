"use client";

import { useRef, useState } from "react";
import { HiPlus, HiX } from "react-icons/hi";

import { AnimatedModal } from "@/components/ui/AnimatedModal";
import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { Input, InputWithLabel } from "@/components/ui/Input";
import { User } from "@prisma/client";

interface Props {
  users: User[];
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

export const AdminList = ({ users }: Props) => {
  const adminUsers = users.filter((user) => user.role === "ADMIN");
  const [userFilter, setUserFilter] = useState<string>("");
  const filteredNonAdminUsers = users.filter((user) => {
    const isNotAdmin = user.role !== "ADMIN";
    const nameData = `${user.firstName} ${user.lastName} ${user.userName}`;
    const isMatching = nameData
      .toLowerCase()
      .includes(userFilter.toLowerCase());
    return isNotAdmin && isMatching;
  });

  const popupRef = useRef<PopupRefActions>(undefined);

  return (
    <section className="flex flex-col gap-3">
      <div className="tex-lg flex w-full flex-col items-start justify-between gap-4 px-5 text-neutral-800 md:flex-row md:items-center md:gap-6 md:px-12 md:text-xl">
        <span className="flex-none text-neutral-500">
          Displaying {adminUsers.length} admin users
        </span>
        <AnimatedPopup ref={popupRef} TriggerComponent={AddAdminButton}>
          <div className="no-scrollbar flex max-h-[95vh] flex-col gap-6 overflow-hidden rounded-xl bg-neutral-50 px-3 py-6 md:px-12 md:py-12 portrait:w-[80vw] landscape:w-[50vw] ">
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
            <div className="no-scrollbar flex-col divide-y-2 divide-neutral-200 overflow-y-scroll">
              {filteredNonAdminUsers.map((user) => (
                <div className="flex w-full items-center justify-between  py-5 text-lg text-neutral-700 md:text-xl">
                  <div>
                    <span className="text-xl font-medium md:text-2xl">
                      {user.firstName} {user.lastName}
                    </span>{" "}
                    ({user.userName})
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 text-primary-400 ">
                    <HiPlus />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedPopup>
      </div>
      <div className="flex flex-col divide-y-2 divide-primary-200 px-5 md:px-12 ">
        {adminUsers.map((user) => (
          <div className="flex w-full items-center justify-between py-5 text-lg text-neutral-700 md:text-xl">
            <div>
              <span className="text-xl font-medium md:text-2xl">
                {user.firstName} {user.lastName}
              </span>{" "}
              ({user.userName}) - Last updated: {user.updatedAt.toDateString()}
            </div>
            <div className=" flex min-h-10 min-w-10 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 text-primary-400 ">
              <HiX />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
