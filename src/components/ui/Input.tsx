"use client";

import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<"input">;

export interface Props extends ButtonProps {
  labelText?: string;
  placeholderText: string;
}

export const Input = ({ labelText, placeholderText, ...props }: Props) => {
  return (
    <div className="flex w-full flex-col-reverse gap-1">
      <input
        {...props}
        className="border-primary-200 focus:border-primary-300 peer rounded-2xl border-2 bg-neutral-50 px-7 py-4 outline-none outline-2 transition-all"
        placeholder={placeholderText}
        id={labelText}
      />
      {labelText && (
        <label
          htmlFor={labelText}
          className="peer-focus:text-primary-500 cursor-pointer text-base font-normal text-neutral-500 transition-all peer-focus:font-medium"
        >
          {labelText}
        </label>
      )}
    </div>
  );
};
