"use client";

import { CustomerWishes } from "@/components/ui/CustomerWishes";
import { useSignals } from "@preact/signals-react/runtime";

const WishAdmin = () => {
  useSignals();
  return (
    <div className="flex w-full max-w-screen-lg flex-col gap-8">
      <h2 className="text-5xl font-semibold text-neutral-700">
        Customer wishes
        {/* TODO: component */}
      </h2>
      <CustomerWishes admin />
    </div>
  );
};

export default WishAdmin;
