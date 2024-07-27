import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { HiCheck } from "react-icons/hi";

const checkboxStyles = cva(
  "flex h-6 w-6 items-center justify-center rounded-lg border transition-all",
  {
    variants: {
      checked: {
        true: "border-primary-500 bg-primary-500 text-white",
        false: "border-neutral-300 bg-neutral-50 text-neutral-50",
      },
    },
  },
);

const textStyles = cva("", {
  variants: {
    categoryLevel: {
      top: "text-base font-medium text-neutral-800",
      sub: "text-sm font-normal text-neutral-700",
    },
  },
});

const containerStyles = cva("flex gap-3", {
  variants: {
    categoryLevel: {
      top: "px-4 py-3.5",
      sub: "px-4 py-2",
    },
  },
});

type InputProps = ComponentPropsWithoutRef<"input">;
type BaseProps = Pick<InputProps, "checked">;

interface CheckboxProps
  extends InputProps,
    Required<VariantProps<typeof textStyles>> {
  itemText: string;
  handleChange?: (checked: boolean) => void;
}

const CheckboxUI = ({ checked }: BaseProps) => {
  return (
    <div className={checkboxStyles({ checked })}>
      <HiCheck size={20} />
    </div>
  );
};

export const CheckboxWithText = ({
  itemText,
  categoryLevel,
  handleChange,
  ...props
}: CheckboxProps) => {
  const { key, checked, ...restProps } = props;

  return (
    <label key={key} className={containerStyles({ categoryLevel })}>
      <input
        {...restProps}
        type="checkbox"
        className="peer hidden"
        checked={checked}
      />
      <CheckboxUI checked={checked} />
      <span className={textStyles({ categoryLevel })}>{itemText}</span>
    </label>
  );
};
