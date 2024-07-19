"use client";

import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  uniqueId: string;
  placeholderText: string;
}

export interface InputWithLabelProps extends InputProps {
  labelText: string;
}

export const Input = forwardRef(
  (
    { uniqueId, placeholderText, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <input
        {...props}
        ref={ref}
        className="hide-spinner peer rounded-xl border-2 border-primary-200 bg-neutral-50 px-7 py-4 text-neutral-600 outline-none outline-2 transition-all placeholder:text-neutral-400 focus:border-primary-300"
        placeholder={placeholderText}
        id={uniqueId}
      />
    );
  },
);

export const InputWithLabel = forwardRef(
  (
    { uniqueId, labelText, placeholderText, ...props }: InputWithLabelProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className="flex w-full flex-col-reverse gap-1">
        <Input
          {...props}
          ref={ref}
          uniqueId={uniqueId}
          placeholderText={placeholderText}
        />
        {labelText && (
          <label
            htmlFor={uniqueId}
            className="cursor-pointer text-base font-normal text-neutral-500 transition-all peer-focus:font-medium peer-focus:text-primary-500"
          >
            {labelText}
          </label>
        )}
      </div>
    );
  },
);
