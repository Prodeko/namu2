import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

export type InputProps = ComponentPropsWithoutRef<"input">;

export const AddFundsInput = forwardRef(
  ({ ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div className="overflow-visible px-16 pr-20 text-7xl font-bold text-neutral-700">
        <input
          {...props}
          ref={ref}
          type="number"
          className="hide-spinner w-20 flex-1 overflow-visible border-none bg-transparent px-0 py-0 text-end focus:outline-none"
        />
        €
      </div>
    );
  },
);
