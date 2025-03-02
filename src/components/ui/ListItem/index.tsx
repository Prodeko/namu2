"use client";

import dynamic from "next/dynamic";
import { type ComponentPropsWithRef, Suspense } from "react";

import { type ClientProduct } from "@/common/types";
import { TextInfoLoading } from "@/components/ui/ListItem/ProductBasicInfo";

export interface ListItemProps extends ComponentPropsWithRef<"li"> {
  product: ClientProduct;
  hideCartIndicator?: boolean;
}

const DynamicClientListItem = dynamic(() => import("./ClientListItem"), {
  ssr: false,
});

export const ListItem = ({ ...props }: ListItemProps) => {
  return (
    <Suspense fallback={<ListItemLoading />}>
      <DynamicClientListItem {...props} />
    </Suspense>
  );
};

const ListItemLoading = () => {
  return (
    <li className="flex h-full w-full justify-between gap-3 py-6 landscape:gap-40">
      <TextInfoLoading />
      <div className="flex gap-5">
        <div className="h-full w-64 animate-pulse rounded-lg bg-primary-200" />
      </div>
    </li>
  );
};
