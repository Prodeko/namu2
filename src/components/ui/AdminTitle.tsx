"use client";

import { useRouter } from "next/navigation";
import { type ComponentProps } from "react";
import { HiArrowLeft } from "react-icons/hi";

import { cn } from "@/lib/utils";

type HeadingProps = ComponentProps<"h2">;

interface Props extends HeadingProps {
  title: string;
  withBackButton?: boolean;
}

export const AdminTitle = ({
  title,
  className,
  withBackButton = false,
  ...props
}: Props) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex h-6 shrink-0 items-center gap-3 px-5 text-neutral-800 md:h-16  md:gap-4 md:px-12",
        className,
      )}
    >
      {withBackButton && (
        <HiArrowLeft
          className="cursor-pointer text-lg md:text-2xl"
          onClick={() => router.back()}
        />
      )}
      <h2
        className={cn(
          "sticky top-0 z-10 bg-neutral-50 text-xl font-semibold text-neutral-700  md:text-2xl 2xl:text-4xl",
          className,
        )}
        {...props}
      >
        {title}
      </h2>
    </div>
  );
};
