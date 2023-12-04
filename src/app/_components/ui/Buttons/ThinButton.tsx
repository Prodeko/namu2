import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentPropsWithRef } from "react";
import { type IconType } from "react-icons";

const buttonStyles = cva(
  "font-medium text-xl flex items-center justify-center gap-1.5 px-7 py-3.5 rounded-full",
  {
    variants: {
        intent: {
          primary: "bg-pink-400 text-pink-50",
          secondary: "bg-pink-100 text-pink-400",
          tertiary: "border-2 border-pink-400 text-pink-400"
        },
        fullwidth: {
          true: "w-full"
        }
    },
  },
);
type ButtonVariantProps = VariantProps<typeof buttonStyles>

interface BaseProps {
  text: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
}

interface ButtonProps extends BaseProps, ComponentPropsWithRef<"button">, Omit<ButtonVariantProps, "intent">,
Required<Pick<ButtonVariantProps, "intent">>  {
  buttonType: "button"
}

export interface LinkProps extends BaseProps, ComponentPropsWithRef<"a">, Omit<ButtonVariantProps, "intent">,
Required<Pick<ButtonVariantProps, "intent">>  {
  buttonType: "a";
  href: string;
}

type Props = LinkProps | ButtonProps;

export const ThinButton = ({ text, LeftIcon, RightIcon, intent, fullwidth, ...props }: Props) => {
  console.log(props)
  if (props.buttonType === "a") {
    return (
      <Link
        {...props}
        href={props.href}
        className={buttonStyles({ intent, fullwidth })}
        >
        {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
        <span>{text}</span>
        {RightIcon && <span>{<RightIcon size={24} />}</span>}
      </Link>
    )
  }

  return (
    <button
      {...props}
      type="button"
      className={buttonStyles({ intent, fullwidth })}
    >
      {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
      <span>{text}</span>
      {RightIcon && <span>{<RightIcon size={24} />}</span>}
    </button>
  );
};
