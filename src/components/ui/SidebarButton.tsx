import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  forwardRef,
} from "react";
import { type IconType } from "react-icons";

import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "flex items-center justify-center gap-2.5 rounded-full px-9 py-[1.125rem] text-2xl font-bold capitalize",
  {
    variants: {
      intent: {
        active: "bg-primary-400 text-primary-50",
        default: "border-4 border-primary-500 bg-primary-50 text-primary-500",
      },
      fullwidth: {
        true: "w-full",
      },
    },
  },
);
type ButtonVariantProps = VariantProps<typeof buttonStyles>;

interface BaseProps {
  text: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
}

export interface LinkProps
  extends BaseProps,
    ComponentPropsWithRef<"a">,
    Omit<ButtonVariantProps, "intent">,
    Required<Pick<ButtonVariantProps, "intent">> {
  href: string;
}

type Props = LinkProps;

export const SidebarButton = ({ text, href, ...props }: Props) => {
  <Link href={href}>
    <p>Test</p>
  </Link>;
};
