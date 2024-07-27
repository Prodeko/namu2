"use client";

import { cva } from "class-variance-authority";
import { useState } from "react";

import { NonEmptyArray } from "@/common/types";
import { cn } from "@/lib/utils";

interface Props<T> {
  options: NonEmptyArray<T>;
  labelText?: string;
  onChange: (value: T) => void;
  className?: string;
  defaultValue?: T;
  style?: "pill" | "rounded";
}

export interface RadioRefActions<T extends string> {
  setValueFromRef: (value: T) => void;
}
const optionStyles = cva(
  "z-10 min-w-[10rem] flex-1 cursor-pointer px-10 py-4 text-center text-2xl text-neutral-800 transition-colors duration-150 landscape:py-3 landscape:text-lg",
  {
    variants: {
      active: {
        true: "text-white",
      },
    },
  },
);

export const RadioInput = <T extends string>(props: Props<T>) => {
  const { options, labelText, className, onChange, style, defaultValue } =
    props;
  const [value, setValue] = useState<T>(
    defaultValue || options[0] || ("" as T),
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
    <div className={cn("flex flex-col-reverse gap-2", className)}>
      <div
        className={cn(
          "relative flex max-w-fit border border-neutral-300 bg-white shadow-inner",
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
