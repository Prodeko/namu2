import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"div"> {
  title: string;
  keys: string[];
  valueGetters: (() => Promise<string | number>)[];
}

export const KeyNumbersSection = async ({
  title,
  keys,
  valueGetters,
  ...props
}: Props) => {
  return (
    <div className="grid grid-cols-2 justify-between gap-2 px-4 py-4">
      <span className="col-span-2 font-bold">{title}</span>
      <div className="text-left">
        {keys.map((key) => (
          <p>{key}</p>
        ))}
      </div>
      <div className="text-right">
        {valueGetters.map(async (getter) => (
          <p>{await getter()}</p>
        ))}
      </div>
    </div>
  );
};
