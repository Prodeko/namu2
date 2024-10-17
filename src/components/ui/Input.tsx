"use client";

import {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useState,
} from "react";
import { HiChevronDown, HiX } from "react-icons/hi";

import { CheckboxWithText } from "@/components/ui/Checkbox";

export type InputProps = ComponentPropsWithoutRef<"input">;

export interface InputWithLabelProps extends InputProps {
  labelText: string;
}

interface ChildlessNode {
  nodeId: number;
  nodeName: string;
}

export interface CategoryNode {
  categoryName: string;
  nodes?: ChildlessNode[];
}

export interface MultiSelectProps extends InputWithLabelProps {
  categories: CategoryNode[];
  selectedIds: number[];
  onSelectAll?: () => void;
  onClearAll?: () => void;
  onSelectCategory?: (categoryName: string) => void;
  onClearCategory?: (categoryName: string) => void;
  onSelectNode?: (nodeId: number) => void;
  onClearNode?: (nodeId: number) => void;
}

export const Input = forwardRef(
  ({ children, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const handleFocus = () => {
      if (typeof ref === "function") {
        // If ref is a function, it can't be used to call focus directly
        // We should use a local ref in this case and call the function ref with it
        console.error(
          "Function refs need special handling to call focus directly",
        );
      } else if (ref && "current" in ref && ref.current) {
        // If ref is an object with a current property, call focus on it
        ref.current.focus();
      }
    };
    return (
      <div
        className="relative flex h-12 items-center justify-between gap-3 rounded-xl border-2 border-neutral-200 bg-white px-4 py-6 shadow-inner outline-none outline-2 transition-all focus-within:border-primary-300  md:px-6 md:py-8 lg:px-4 lg:py-7"
        onClick={handleFocus}
        onKeyDown={handleFocus}
      >
        <input
          {...props}
          ref={ref}
          className="hide-spinner min-w-0 grow bg-inherit py-0 text-lg text-neutral-600 outline-none placeholder:text-neutral-400 md:text-2xl lg:text-lg"
        />
        {children}
      </div>
    );
  },
);

export const InputWithLabel = forwardRef(
  (
    { labelText, children, key, ...props }: InputWithLabelProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <label key={key} className="group flex w-full flex-col gap-1">
        {labelText && (
          <span className="w-fit cursor-pointer text-sm font-normal  text-neutral-500 transition-all group-focus-within:font-medium group-focus-within:text-primary-500 md:text-base">
            {labelText}
          </span>
        )}
        <Input {...props} ref={ref}>
          {children}
        </Input>
      </label>
    );
  },
);

export const MultiSelect = forwardRef(
  (
    {
      labelText,
      categories,
      selectedIds,
      onSelectAll,
      onClearAll,
      onSelectCategory,
      onClearCategory,
      onSelectNode,
      onClearNode,
      ...props
    }: MultiSelectProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const openDropdown = () => setDropdownOpen(true);
    const closeDropdown = () => setDropdownOpen(false);
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const handleGlobalChange: ChangeEventHandler<HTMLInputElement> = (
      event,
    ) => {
      if (event.target.checked) {
        onSelectAll?.();
      } else {
        onClearAll?.();
      }
    };

    const handleCategoryChange = (
      categoryName: string,
    ): ChangeEventHandler<HTMLInputElement> => {
      return (event) => {
        if (event.target.checked) {
          onSelectCategory?.(categoryName);
        } else {
          onClearCategory?.(categoryName);
        }
      };
    };

    const handleNodeChange = (
      nodeId: number,
    ): ChangeEventHandler<HTMLInputElement> => {
      return (event) => {
        if (event.target.checked) {
          onSelectNode?.(nodeId);
        } else {
          onClearNode?.(nodeId);
        }
      };
    };

    return (
      <InputWithLabel
        {...props}
        ref={ref}
        onClick={toggleDropdown}
        // onBlur={closeDropdown}
        labelText={labelText}
      >
        <div className="flex w-fit items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-3 rounded-lg bg-primary-400 px-4 py-2 text-lg font-medium text-white"
            >
              {selectedIds.length} <HiX size={20} />
            </button>
          )}
          <HiChevronDown
            size={24}
            className={`transform text-primary-400 transition-transform ${
              dropdownOpen && "rotate-180"
            }`}
          />
        </div>
        {dropdownOpen && (
          <div className="absolute left-0 top-[4.5rem] z-10 flex h-96 w-full flex-col divide-y-4 divide-neutral-200 rounded-xl border-2 border-primary-200 bg-white shadow-lg">
            <CheckboxWithText
              categoryLevel={"top"}
              itemText="Select All"
              checked={categories.every(
                (category) =>
                  category.nodes?.every((node) =>
                    selectedIds.includes(node.nodeId),
                  ),
              )}
              onChange={handleGlobalChange}
            />
            <div className="flex flex-col divide-y-2 overflow-y-auto">
              {categories.map((category) => {
                const categoryName = category.categoryName;
                return (
                  <div className="flex flex-col gap-1">
                    <CheckboxWithText
                      key={categoryName}
                      categoryLevel={"top"}
                      itemText={categoryName}
                      checked={category.nodes?.every((node) =>
                        selectedIds.includes(node.nodeId),
                      )}
                      onChange={handleCategoryChange(categoryName)}
                    />
                    <div className="flex flex-col pb-4 pl-7">
                      {category.nodes?.map((node) => {
                        const nodeName = node.nodeName;
                        return (
                          <CheckboxWithText
                            key={`${categoryName}-${nodeName}`}
                            categoryLevel={"sub"}
                            itemText={nodeName}
                            checked={selectedIds.includes(node.nodeId)}
                            onChange={handleNodeChange(node.nodeId)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </InputWithLabel>
    );
  },
);
