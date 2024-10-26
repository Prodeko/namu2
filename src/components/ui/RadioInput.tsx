"use client";

import { cva } from "class-variance-authority";
import { useImperativeHandle, useState } from "react";

import { NonEmptyArray } from "@/common/types";
import { cn } from "@/lib/utils";

interface Props<T extends string> {
  options: NonEmptyArray<T>;
  labelText?: string;
  onChange: (value: T) => void;
  className?: string;
  defaultValue?: T;
  style?: "pill" | "rounded";
  ref?: React.Ref<RadioRefActions<T>>;
}

export interface RadioRefActions<T extends string> {
  setValueFromRef: (value: T) => void;
}
const optionStyles = cva(
  "z-10  flex-1 cursor-pointer py-3 text-center text-lg text-neutral-800 transition-colors duration-150 md:py-4 md:text-2xl landscape:py-3 landscape:text-lg",
  {
    variants: {
      active: {
        true: "text-white",
      },
    },
  },
);

export const RadioInput = <T extends string>({ ref, ...props }: Props<T>) => {
  const { options, labelText, className, onChange, style, defaultValue } =
    props;
  const [value, setValue] = useState<T>(
    defaultValue || options[0] || ("" as T),
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        setValueFromRef: (value: T) => {
          setValue(value);
        },
      };
    },
    [],
  );

  const getIndicatorLength = (): number => Math.round(100 / options.length);
  const getIndicatorPos = (): number =>
    getIndicatorLength() * options.indexOf(value);
  const getIndicatorStyle = () => {
    return {
      width: `${getIndicatorLength()}%`,
      left: `${getIndicatorPos()}%`,
    };
  };
  const getBorderRadius = () =>
    style === "pill" ? "rounded-full" : "rounded-xl";

  const changeValue = (value: T) => {
    setValue(value);
    onChange(value);
  };
  return (
    <div className={cn("flex w-full flex-col-reverse", className)}>
      <div
        className={cn(
          "relative flex w-full border border-neutral-300 bg-white shadow-inner",
          getBorderRadius(),
        )}
      >
        {options.map((option) => (
          <div
            key={option}
            onClick={() => changeValue(option)}
            onKeyUp={() => changeValue(option)}
            className={optionStyles({ active: value === option })}
          >
            {option}
          </div>
        ))}
        {/* Indicator */}
        <div
          className={cn(
            "absolute top-0 h-full bg-primary-400 shadow-md transition-all duration-150",
            getBorderRadius(),
          )}
          style={getIndicatorStyle()}
        />
      </div>
      {labelText && (
        <label
          htmlFor={labelText}
          className="cursor-pointer text-base font-normal text-neutral-500 transition-all peer-focus:font-medium peer-focus:text-primary-500"
        >
          {labelText}
        </label>
      )}
    </div>
  );
};
