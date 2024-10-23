import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentPropsWithRef, ForwardedRef } from "react";
import { type IconType } from "react-icons";

import { cn } from "@/lib/utils";
import { ValueError } from "@/server/exceptions/exception";

const buttonStyles = cva(
  "flex items-center justify-center rounded-[50%] border-none bg-primary-50 text-primary-500 shadow-inner",
  {
    variants: {
      sizing: {
        lg: "h-20 w-20",
        md: "h-12 w-12 text-xl md:h-16 md:w-16 md:text-3xl",
        sm: "h-12 w-12",
        xs: "h-10 w-10",
      },
      fullwidth: {
        true: "w-full",
      },
    },
  },
);
type ButtonVariantProps = VariantProps<typeof buttonStyles>;

interface BaseProps {
  Icon: IconType;
}

type RequiredFields = "sizing";

/**
 * Utility type to make a subset of properties non-nullable
 */
type MakeNonNullable<Type, Key extends keyof Type> = Omit<Type, Key> & {
  [P in Key]-?: NonNullable<Type[P]>;
};

type RequiredProps = MakeNonNullable<ButtonVariantProps, RequiredFields>;
type OptionalProps = Omit<ButtonVariantProps, RequiredFields>;

interface ButtonProps
  extends BaseProps,
    ComponentPropsWithRef<"button">,
    OptionalProps,
    RequiredProps {
  buttonType: "button";
}

export interface LinkProps
  extends BaseProps,
    ComponentPropsWithRef<"a">,
    OptionalProps,
    RequiredProps {
  buttonType: "a";
  href: string;
}

const GetIconSize = (sizing: RequiredProps[RequiredFields]): number => {
  switch (sizing) {
    case "lg":
      return 52;
    case "md":
      return 32;
    case "sm":
      return 24;
    case "xs":
      return 20;
    default:
      throw new ValueError({
        cause: "invalid_option",
        message: `Invalid sizing value: ${sizing}`,
      });
  }
};

type Props = LinkProps | ButtonProps;
type RefProps<T extends Props> = T extends LinkProps
  ? ForwardedRef<HTMLAnchorElement>
  : ForwardedRef<HTMLButtonElement>;

export const IconButton = ({ ref, ...props }: Props) => {
  if (props.buttonType === "a") {
    const {
      href,
      Icon,
      sizing,
      fullwidth,
      buttonType,
      className,
      ...restProps
    } = props;
    return (
      <Link
        {...restProps}
        href={href}
        ref={ref as RefProps<LinkProps>}
        className={cn(buttonStyles({ sizing, fullwidth }), className)}
      >
        <Icon />
      </Link>
    );
  }

  const { Icon, sizing, fullwidth, buttonType, className, ...restProps } =
    props;
  return (
    <button
      {...restProps}
      type={restProps.type}
      ref={ref as RefProps<ButtonProps>}
      className={cn(buttonStyles({ sizing, fullwidth }), className)}
    >
      <Icon />
    </button>
  );
};
