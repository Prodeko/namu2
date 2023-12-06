import { type ComponentProps } from "react";

type TextAreaProps = ComponentProps<"textarea">;

interface Props extends TextAreaProps {
  description: string;
  text: string;
}

export const TextArea = ({ text, description, ...props }: Props) => {
  return (
    <div className="flex flex-grow flex-col gap-2">
      <text className="text-sm">{description}</text>
      <textarea
        className="flex-grow resize-none rounded-2xl bg-white px-7 pt-7 text-2xl text-neutral-700 shadow-md placeholder:text-neutral-400"
        placeholder={text}
        {...props}
      />
    </div>
  );
};
