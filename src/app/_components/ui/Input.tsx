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
        className="peer rounded-2xl px-7 py-4 border-pink-200 border-2 outline-none focus:border-pink-300 outline-2 transition-all"
        placeholder={placeholderText}
        id={labelText}
      />
      {labelText && (
        <label
          htmlFor={labelText}
          className="text-base font-normal text-slate-500 cursor-pointer peer-focus:text-pink-500 peer-focus:font-medium transition-all"
        >
          {labelText}
        </label>
      )}
    </div>
  );
};
