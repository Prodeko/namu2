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
    <div className="grid grid-cols-3 justify-between gap-3 p-4">
      <span className="col-span-full text-sm font-bold lg:text-base">
        {title}
      </span>
      <div className="col-span-2 flex flex-col gap-1 text-left text-sm lg:text-base">
        {keys.map((key) => (
          <p key={key}>{key}</p>
        ))}
      </div>
      <div className="col-span-1 flex flex-col gap-1 text-right text-sm lg:text-base">
        {valueGetters.map(async (getter) => (
          <p>{await getter()}</p>
        ))}
      </div>
    </div>
  );
};
