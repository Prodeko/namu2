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
        "flex h-16 shrink-0 items-center gap-4 text-neutral-800",
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
      <h2 className="text-4xl font-bold capitalize text-inherit " {...props}>
        {title}
      </h2>
    </div>
  );
};
