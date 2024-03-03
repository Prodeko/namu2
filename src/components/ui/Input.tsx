"use client";

import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

export interface Props extends ComponentPropsWithoutRef<"input"> {
  labelText?: string;
  placeholderText: string;
  value?: string | number | undefined;
}

export const Input = forwardRef(
  (
    { labelText, placeholderText, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className="flex w-full flex-col-reverse gap-1">
        <input
          {...props}
          ref={ref}
          className="hide-spinner peer rounded-xl border-2 border-primary-200 bg-neutral-50 px-7 py-4 outline-none outline-2 transition-all focus:border-primary-300"
          placeholder={placeholderText}
          id={labelText}
        />
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
  },
);
