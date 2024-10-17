import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

export type InputProps = ComponentPropsWithoutRef<"input">;

export const AddFundsInput = forwardRef(
  ({ ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div className="overflow-visible text-5xl font-bold text-neutral-700 md:text-7xl">
        <input
          {...props}
          ref={ref}
          type="number"
          tabIndex={-1}
          className="hide-spinner w-20 flex-1 overflow-visible border-none bg-transparent px-0 py-0 text-end focus:outline-none"
        />
        €
      </div>
    );
  },
);
