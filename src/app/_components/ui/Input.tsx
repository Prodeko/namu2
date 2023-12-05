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
        className="peer rounded-2xl border-2 border-pink-200 bg-slate-50 px-7 py-4 outline-none outline-2 transition-all focus:border-pink-300"
        placeholder={placeholderText}
        id={labelText}
      />
      {labelText && (
        <label
          htmlFor={labelText}
          className="cursor-pointer text-base font-normal text-slate-500 transition-all peer-focus:font-medium peer-focus:text-pink-500"
        >
          {labelText}
        </label>
      )}
    </div>
  );
};
