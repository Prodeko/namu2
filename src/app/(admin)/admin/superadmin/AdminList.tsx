"use client";

import toast from "react-hot-toast";
import { HiX } from "react-icons/hi";

import { changeUserRole } from "@/server/actions/admin/changeRole";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Role, User } from "@prisma/client";

import { NewAdminDialog } from "./NewAdminDialog";

interface Props {
  users: User[];
}

export const AdminList = ({ users }: Props) => {
  const adminUsers = users.filter((user) => user.role === "ADMIN");

  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  const changeRole = async (user: User, role: Role) => {
    try {
      await changeUserRole(user.id, role);
      toast.success("User role changed successfully");
    } catch (error) {
      toast.error(`Failed to change user role: ${error}`);
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="tex-lg flex w-full flex-col items-start justify-between gap-4 px-5 text-neutral-800 md:flex-row md:items-center md:gap-6 md:px-12 md:text-xl">
        <span className="flex-none text-neutral-500">
          Displaying {adminUsers.length} admin users
        </span>
        <NewAdminDialog users={users} />
      </div>
      <div
        ref={parent}
        className="flex flex-col divide-y-2 divide-primary-200 px-5 md:px-12 "
      >
        {adminUsers.map((user) => (
          <div
            key={user.id}
            className="flex w-full items-center justify-between py-5 text-lg text-neutral-700 md:text-xl"
          >
            <div>
              <span className="text-xl font-medium md:text-2xl">
                {user.firstName} {user.lastName}
              </span>{" "}
              ({user.userName}) - Last updated: {user.updatedAt.toDateString()}
            </div>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              onClick={() => changeRole(user, "USER")}
              className=" flex min-h-10 min-w-10 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 text-primary-400 "
            >
              <HiX />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
