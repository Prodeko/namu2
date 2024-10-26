import { type ComponentProps } from "react";

type TextAreaProps = ComponentProps<"textarea">;

interface Props extends TextAreaProps {
  labelText?: string;
}

export const TextArea = ({ labelText, ...props }: Props) => {
  return (
    <div className="flex grow flex-col-reverse gap-1">
      <textarea
        {...props}
        className="peer flex flex-grow resize-none rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 shadow-inner outline-none outline-2 transition-all focus:border-primary-300 md:rounded-2xl md:px-7 md:py-4"
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
