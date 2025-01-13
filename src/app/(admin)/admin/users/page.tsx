import { AdminTitle } from "@/components/ui/AdminTitle";
import { getAllUsers } from "@/server/db/queries/account";

import { UserList } from "./UserList";

const ManageUsers = async () => {
  const users = await getAllUsers();
  return (
    <div className="no-scrollbar flex h-fit w-full max-w-screen-lg flex-col gap-8 overflow-y-scroll px-0 lg:w-[80%]">
      <AdminTitle title="Manage users" />
      <UserList users={users} />
    </div>
  );
};

export default ManageUsers;
