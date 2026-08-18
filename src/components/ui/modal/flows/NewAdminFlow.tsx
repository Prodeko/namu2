"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { HiPlus } from "react-icons/hi";

import { ClientUser } from "@/common/types";
import { InputWithLabel } from "@/components/ui/Input";
import { changeUserRole } from "@/server/actions/admin/changeRole";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Modal } from "../Modal";
import { createModalFlow } from "../modalSystem";

const NewAdminContent = ({ users }: { users: ClientUser[] }) => {
  const [availableUsers, setAvailableUsers] = useState<ClientUser[]>(users);
  const [userFilter, setUserFilter] = useState<string>("");
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  const filteredNonAdminUsers = availableUsers.filter((user) => {
    const isNotAdmin = user.role !== "ADMIN" && user.role !== "SUPERADMIN";
    const nameData = `${user.firstName} ${user.lastName} ${user.userName}`;
    const isMatching = nameData
      .toLowerCase()
      .includes(userFilter.toLowerCase());
    return isNotAdmin && isMatching;
  });

  const promote = async (user: ClientUser) => {
    try {
      await changeUserRole(user.id, "ADMIN");
      toast.success("User role changed successfully");
      // Remove the promoted user so the list updates while the modal stays open.
      setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      toast.error(`Failed to change user role: ${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <InputWithLabel
        labelText="Search for user"
        placeholder="Search by name or username..."
        value={userFilter}
        onChange={(e) => setUserFilter(e.target.value.toLowerCase())}
      />
      <div
        ref={parent}
        className="no-scrollbar flex h-[65vh] flex-col divide-y-2 divide-neutral-200 overflow-y-auto md:h-[45vh]"
      >
        {filteredNonAdminUsers.map((user) => (
          <div
            key={user.id}
            className="flex w-full items-center justify-between py-5 text-lg text-neutral-700 md:text-xl"
          >
            <div>
              <span className="text-xl font-medium md:text-2xl">
                {user.firstName} {user.lastName}
              </span>{" "}
              ({user.userName})
            </div>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              onClick={() => promote(user)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 text-primary-400 "
            >
              <HiPlus />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NewAdminFlow = createModalFlow<{ users: ClientUser[] }>(
  ({ users }) => (
    <Modal>
      <Modal.Page title="Add administrator">
        <NewAdminContent users={users} />
      </Modal.Page>
    </Modal>
  ),
);
