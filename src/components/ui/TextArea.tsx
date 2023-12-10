import { type ComponentProps } from "react";

type TextAreaProps = ComponentProps<"textarea">;

interface Props extends TextAreaProps {
  labelText?: string;
  placeholderText: string;
}

export const TextArea = ({ labelText, placeholderText, ...props }: Props) => {
  return (
    <div className="flex w-full flex-col-reverse gap-1">
      <textarea
        {...props}
        className="peer flex-grow resize-none rounded-2xl border-2 border-primary-200 bg-neutral-50 px-7 py-4 outline-none outline-2 transition-all focus:border-primary-300"
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
};
