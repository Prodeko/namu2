import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentPropsWithRef } from "react";
import { type IconType } from "react-icons";

const buttonStyles = cva(
  "flex items-center justify-center rounded-[50%] bg-pink-50 border-pink-500 text-pink-500",
  {
    variants: {
        sizing: {
          lg: "border-4 p-4",
          md: "border-[3px] p-4",
          sm: "border-[3px] p-3",
          xs: "border-2 p-2",
        },
        fullwidth: {
          true: "w-full"
        }
    },
  },
);
type ButtonVariantProps = VariantProps<typeof buttonStyles>

interface BaseProps {
  Icon: IconType;
}

type RequiredFields = "sizing"

/**
 * Utility type to make a subset of properties non-nullable
 */
type MakeNonNullable<Type, Key extends keyof Type> = Omit<Type, Key> & { [P in Key]-?: NonNullable<Type[P]> };

type RequiredProps = MakeNonNullable<ButtonVariantProps, RequiredFields>;
type OptionalProps = Omit<ButtonVariantProps, RequiredFields>;

interface ButtonProps extends BaseProps, ComponentPropsWithRef<"button">, OptionalProps,
RequiredProps  {
  buttonType: "button"
}

export interface LinkProps extends BaseProps, ComponentPropsWithRef<"a">, OptionalProps,
RequiredProps  {
  buttonType: "a";
  href: string;
}

const GetIconSize = (sizing: RequiredProps[RequiredFields]): number => {
  switch (sizing) {
    case "lg":
      return 52;
    case "md":
      return 36;
    case "sm":
      return 24;
    case "xs":
      return 20;
    default:
      throw new Error("Invalid sizing: ", sizing);
  }
}

type Props = LinkProps | ButtonProps;


export const IconButton = (props: Props) => {
  if (props.buttonType === "a") {
    const { href, Icon, sizing, fullwidth, buttonType, ...restProps } = props;
    return (
      <Link
      {...restProps}
      href={href}
      className={buttonStyles({ sizing, fullwidth })}
      >
        <Icon size={GetIconSize(sizing)} />
      </Link>
    )
  }

  const { Icon, sizing, fullwidth, buttonType, ...restProps } = props;
  return (
    <button
      {...restProps}
      type="button"
      className={buttonStyles({ sizing, fullwidth })}
    >
      <Icon size={GetIconSize(sizing)} />
    </button>
  );
};
