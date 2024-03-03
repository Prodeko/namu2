"use client";

import {
  ComponentPropsWithRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type DivProps = ComponentPropsWithRef<"div">;

interface Props {
  options: string[];
  labelText?: string;
  className?: string;
  onChange?: (value: string) => void;
  style?: "pill" | "rounded";
}
export const RadioInput = forwardRef((props: Props, ref) => {
  const { options, labelText, className, onChange, style = "pill" } = props;
  const [value, setValue] = useState(options[0] || "");
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

  const getOptionStyle = (option: string) => {
    return value === option ? { color: "white" } : {};
  };
  const changeValue = (value: string) => {
    setValue(value);
    if (onChange) onChange(value);
  };
  useImperativeHandle(ref, () => ({
    setValueFromRef(value: string) {
      // tunk
      setValue(value);
    },
  }));

  return (
    <div className={cn("flex flex-col-reverse gap-2", className)}>
      <div
        className={cn(
          "relative flex max-w-fit bg-white shadow-inner",
          getBorderRadius(),
        )}
      >
        {options.map((option) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={option}
            onClick={() => changeValue(option)}
            className=" z-10 min-w-[10rem] flex-1 cursor-pointer px-10 py-4 text-center text-2xl text-neutral-800 transition-colors duration-150 landscape:py-3 landscape:text-lg"
            style={getOptionStyle(option)}
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
});
