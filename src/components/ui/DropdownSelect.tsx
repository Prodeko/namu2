import { ComponentPropsWithoutRef } from "react";
import { HiCheck, HiChevronDown } from "react-icons/hi";

import { NonEmptyArray } from "@/common/types";
import { cn } from "@/lib/utils";
import * as Select from "@radix-ui/react-select";

interface Props<T extends string> extends ComponentPropsWithoutRef<"select"> {
  choices: NonEmptyArray<T>;
  value?: T;
  defaultValue?: T;
  placeholder?: string;
  onValueChange?: (value: T) => void;
  labelText?: string;
}

export const DropdownSelect = <T extends string>({
  choices,
  value,
  onValueChange,
  defaultValue,
  placeholder,
  labelText,
  ...props
}: Props<T>) => {
  return (
    <div className={cn("flex flex-col-reverse gap-1", props.className)}>
      <Select.Root
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
      >
        <Select.Trigger
          className="focus:border-primary-30 flex items-center justify-between rounded-xl border-2 border-primary-200 bg-white px-7 py-4 text-neutral-500 outline-none outline-2 transition-all"
          id="food"
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="text-primary-400">
            <HiChevronDown size={25} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content className="overflow-hidden rounded-xl border-2 bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
          <Select.Viewport className="rounded-xl">
            {choices.map((choice) => (
              <Select.Item
                key={choice}
                value={choice}
                className="flex justify-between  px-7 py-3"
              >
                <Select.ItemText>
                  <span className="text-neutral-700">{choice}</span>
                </Select.ItemText>
                <Select.ItemIndicator className=" inline-flex w-[25px] items-center justify-center">
                  <HiCheck />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
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
