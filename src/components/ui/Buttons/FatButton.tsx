import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentPropsWithRef } from "react";
import { type IconType } from "react-icons";

const buttonStyles = cva(
  "flex items-center justify-center gap-2.5 rounded-full px-9 py-[1.125rem] text-2xl font-bold",
  {
    variants: {
      intent: {
        primary: "bg-primary-500 text-primary-50",
        secondary: "border-4 border-primary-500 bg-primary-50 text-primary-500",
        tertiary: "border-4 border-primary-500 text-primary-500",
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

interface ButtonProps
  extends BaseProps,
    ComponentPropsWithRef<"button">,
    Omit<ButtonVariantProps, "intent">,
    Required<Pick<ButtonVariantProps, "intent">> {
  buttonType: "button";
}

export interface LinkProps
  extends BaseProps,
    ComponentPropsWithRef<"a">,
    Omit<ButtonVariantProps, "intent">,
    Required<Pick<ButtonVariantProps, "intent">> {
  buttonType: "a";
  href: string;
}

type Props = LinkProps | ButtonProps;

export const FatButton = (props: Props) => {
  if (props.buttonType === "a") {
    const {
      text,
      href,
      LeftIcon,
      RightIcon,
      intent,
      fullwidth,
      buttonType,
      ...restProps
    } = props;
    return (
      <Link
        {...restProps}
        href={href}
        className={buttonStyles({ intent, fullwidth })}
      >
        {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
        <span>{text}</span>
        {RightIcon && <span>{<RightIcon size={24} />}</span>}
      </Link>
    );
  }

  const {
    text,
    LeftIcon,
    RightIcon,
    intent,
    fullwidth,
    buttonType,
    ...restProps
  } = props;
  return (
    <button
      {...restProps}
      type="button"
      className={buttonStyles({ intent, fullwidth })}
    >
      {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
      <span>{text}</span>
      {RightIcon && <span>{<RightIcon size={24} />}</span>}
    </button>
  );
};
