import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

import { ComponentPropsWithRef } from "@react-spring/web";

interface Props extends ComponentPropsWithRef<"input"> {
  leftButtonAction: () => void;
  rightButtonAction: () => void;
  onInputChange: (value: number) => void;
  inputValue: number;
  maxValue?: number;
  labelText?: string;
}

const buttonStyles = cva(
  "text-slate-700 transition-colors duration-300 disabled:text-slate-400",
);

export const ButtonGroup = ({
  leftButtonAction,
  rightButtonAction,
  onInputChange,
  inputValue,
  maxValue = 99999,
  labelText,
  ...props
}: Props) => {
  const [textValue, setTextValue] = useState<string>(inputValue.toString());
  const iconStyles = cva("h-7 w-7");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setTextValue(newValue);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsedValue = parseInt(newValue);
    if (Number.isNaN(parsedValue)) {
      setTextValue(inputValue.toString());
    } else {
      const minMaxParsedValue = Math.min(Math.max(parsedValue, 1), maxValue);
      onInputChange(minMaxParsedValue);
    }
  };

  useEffect(() => {
    setTextValue(inputValue.toString());
  }, [inputValue]);

  const styles = cva(`flex flex-col gap-1 ${props.className || ""}`);

  return (
    <div className={styles()}>
      {labelText && (
        <span className="w-fit cursor-pointer text-base font-normal text-neutral-500 transition-all group-focus-within:font-medium group-focus-within:text-primary-500">
          {labelText}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <button
          className={buttonStyles()}
          disabled={inputValue === 1}
          type="button"
          onClick={leftButtonAction}
        >
          <HiMinus className={iconStyles()} />
        </button>
        <input
          type="number"
          value={textValue}
          onBlur={handleBlur}
          onChange={handleInputChange}
          className="hide-spinner flex h-12 w-12 appearance-none items-center justify-center rounded bg-primary-100 text-center text-2xl font-medium text-primary-900 outline-primary-700"
        />
        <button
          type="button"
          onClick={rightButtonAction}
          className={buttonStyles()}
          disabled={inputValue >= maxValue}
        >
          <HiPlus className={iconStyles()} />
        </button>
      </div>
    </div>
  );
};
