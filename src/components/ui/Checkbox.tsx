import { type VariantProps, cva } from "class-variance-authority";
import { ChangeEvent, ComponentPropsWithoutRef, useState } from "react";
import { HiCheck } from "react-icons/hi";

const checkboxStyles = cva(
  "flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-50 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-300 active:border-primary-500 active:bg-primary-50 active:text-primary-500",
  {
    variants: {
      checked: {
        true: "border-primary-500 bg-primary-500 text-white",
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
  const [isChecked, setIsChecked] = useState<boolean | undefined>(checked);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (handleChange) {
      handleChange(newChecked);
    }
  };

  return (
    <label key={key} className={containerStyles({ categoryLevel })}>
      <input
        {...restProps}
        type="checkbox"
        className="peer hidden"
        checked={isChecked}
        onChange={onChange}
      />
      <CheckboxUI checked={isChecked} />
      <span className={textStyles({ categoryLevel })}>{itemText}</span>
    </label>
  );
};
