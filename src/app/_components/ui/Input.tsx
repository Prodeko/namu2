import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<"input">;

export interface Props extends ButtonProps {
  labelText?: string;
  placeholderText: string;
}

export const Input = ({ labelText, placeholderText, ...props }: Props) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {labelText && (
        <label
          htmlFor={labelText}
          className="text-base font-normal text-gray-400"
        >
          {labelText}
        </label>
      )}
      <input
        {...props}
        className="rounded-2xl px-7 py-4 shadow-md"
        placeholder={placeholderText}
        id={labelText}
      />
    </div>
  );
};
