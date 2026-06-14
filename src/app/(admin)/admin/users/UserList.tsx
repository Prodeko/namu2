"use client";

import { HiPencil } from "react-icons/hi";

import { ClientUser } from "@/common/types";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { showModal } from "@/components/ui/modal";
import { ManageUserFlow } from "@/components/ui/modal/flows/ManageUserFlow";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  users: ClientUser[];
}

export const UserList = ({ users }: Props) => {
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  return (
    <section className="flex flex-col gap-3">
      <div className="tex-lg flex w-full flex-col items-start justify-between gap-4 px-5 text-neutral-800 md:flex-row md:items-center md:gap-6 md:px-12 md:text-xl">
        <span className="flex-none text-neutral-500">
          Displaying {users.length} users
        </span>
      </div>
      <div
        ref={parent}
        className="flex flex-col divide-y-2 divide-neutral-200 px-5 md:px-12 "
      >
        {users.map((user) => (
          <div
            key={user.id}
            className="text-md flex w-full items-center justify-between py-5 text-neutral-500 md:py-5 md:text-xl"
          >
            <div>
              <span className="text-xl font-medium text-neutral-700 md:text-2xl">
                {user.firstName} {user.lastName}
              </span>{" "}
              ({user.userName})
            </div>
            <IconButton
              buttonType="button"
              Icon={HiPencil}
              sizing="xs"
              onClick={() => void showModal(ManageUserFlow, { user })}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
