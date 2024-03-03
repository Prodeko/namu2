import { useRouter } from "next/navigation";
import { type ComponentProps } from "react";
import { HiArrowLeft } from "react-icons/hi";

import { cn } from "@/lib/utils";

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
    <div className={cn("flex items-center gap-2 text-neutral-800", className)}>
      {withBackButton && (
        <HiArrowLeft
          size={25}
          className="text-neutral-800"
          onClick={() => router.back()}
        />
      )}
      <h2 className="text-4xl font-bold capitalize text-inherit " {...props}>
        {title}
      </h2>
    </div>
  );
};
