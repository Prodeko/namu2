"use client";

import { useRouter } from "next/navigation";
import { type ComponentProps } from "react";
import { HiArrowLeft } from "react-icons/hi";

import { cn } from "@/lib/utils";

import { IconButton } from "./Buttons/IconButton";

type HeadingProps = ComponentProps<"h2">;

interface Props extends HeadingProps {
  title: string;
  withBackButton?: boolean;
}

export const SectionTitle = ({
  title,
  className,
  withBackButton = false,
  ...props
}: Props) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "flex h-6 shrink-0 items-center gap-4 text-neutral-800 md:h-16",
        className,
      )}
    >
      {withBackButton && (
        <IconButton
          sizing="md"
          Icon={HiArrowLeft}
          buttonType="button"
          onClick={() => router.back()}
        />
      )}
      <h2
        className="text-2xl font-bold capitalize text-inherit md:text-3xl "
        {...props}
      >
        {title}
      </h2>
    </div>
  );
};
