"use client";

import { AdminTitle } from "@/components/ui/AdminTitle";
import { CustomerWishes } from "@/components/ui/CustomerWishes";
import { useSignals } from "@preact/signals-react/runtime";

const WishAdmin = () => {
  useSignals();
  return (
    <div className="flex w-[80%] max-w-screen-lg flex-col gap-8">
      <AdminTitle title="Customer wishes" />

      <CustomerWishes admin />
    </div>
  );
};

export default WishAdmin;
