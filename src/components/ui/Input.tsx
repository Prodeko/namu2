"use client";

import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useState,
} from "react";
import { HiChevronDown, HiX } from "react-icons/hi";

import { CheckboxWithText } from "./Checkbox";

export type InputProps = ComponentPropsWithoutRef<"input">;

export interface InputWithLabelProps extends InputProps {
  labelText: string;
}

export interface MultiSelectProps extends InputWithLabelProps {
  selectedItems: string[];
  onSelectAll?: () => void;
  onClearAll?: () => void;
  onSelectCategory?: (category: string) => void;
  onClearCategory?: (category: string) => void;
  onSelectItem?: (item: string) => void;
  onClearItem?: (item: string) => void;
}

export const Input = forwardRef(
  ({ children, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div
        className="relative flex h-16 items-center gap-3 rounded-xl border-2 border-primary-200 bg-primary-50 px-7  outline-none outline-2 transition-all  focus-within:border-primary-300"
        onClick={() => ref?.current?.focus()}
        onKeyDown={() => ref?.current?.focus()}
      >
        <input
          {...props}
          ref={ref}
          className="hide-spinner flex-grow bg-inherit text-neutral-600 outline-none placeholder:text-neutral-400"
        />
        {children}
      </div>
    );
  },
);

export const InputWithLabel = forwardRef(
  (
    { labelText, ...props }: InputWithLabelProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <label className="group flex w-full flex-col gap-1">
        {labelText && (
          <span className="w-min cursor-pointer text-base font-normal text-neutral-500 transition-all group-focus-within:font-medium group-focus-within:text-primary-500">
            {labelText}
          </span>
        )}
        <Input {...props} ref={ref} />
      </label>
    );
  },
);

const categories = [
  {
    name: "Category 1",
    items: ["Item 1", "Item 2", "Item 3"],
  },
  {
    name: "Category 2",
    items: ["Item 1", "Item 2", "Item 3"],
  },
  {
    name: "Category 3",
    items: ["Item 1", "Item 2", "Item 3"],
  },
];

export const MultiSelect = forwardRef(
  (
    {
      labelText,
      selectedItems,
      onSelectAll,
      onClearAll,
      onSelectCategory,
      onClearCategory,
      onSelectItem,
      onClearItem,
      ...props
    }: MultiSelectProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const openDropdown = () => setDropdownOpen(true);
    const closeDropdown = () => setDropdownOpen(false);
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    return (
      <InputWithLabel
        {...props}
        ref={ref}
        onClick={toggleDropdown}
        // onBlur={closeDropdown}
        labelText={labelText}
      >
        {selectedItems.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex gap-4 rounded-lg bg-primary-400 px-6 py-2 text-2xl text-white"
          >
            {selectedItems.length} <HiX size={24} />
          </button>
        )}
        <HiChevronDown
          size={24}
          className={`transform text-primary-400 transition-transform ${
            dropdownOpen && "rotate-180"
          }`}
        />
        {dropdownOpen && (
          <div className="absolute left-0 top-[4.5rem] z-10 flex h-96 w-full flex-col divide-y-4 divide-neutral-200 rounded-xl border-2 border-primary-200 bg-white shadow-lg">
            <CheckboxWithText categoryLevel={"top"} itemText="Select All" />
            <div className="flex flex-col divide-y-2 overflow-y-auto">
              {categories.map((category) => (
                <div className="flex flex-col gap-1">
                  <CheckboxWithText
                    key={category.name}
                    categoryLevel={"top"}
                    itemText={category.name}
                  />
                  <div className="flex flex-col pb-4 pl-7">
                    {category.items.map((item) => (
                      <CheckboxWithText
                        key={`${category.name}-${item}`}
                        categoryLevel={"sub"}
                        itemText={item}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </InputWithLabel>
    );
  },
);
