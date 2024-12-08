"use client";

import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { HiX } from "react-icons/hi";

import { ClientLegacyUser, NonEmptyArray } from "@/common/types";
import { getUnmigratedAccounts } from "@/server/actions/account/migration";
import { Combobox } from "@headlessui/react";

interface ComboBoxProps<T> extends ComponentPropsWithoutRef<"input"> {
  options: NonEmptyArray<T>;
  labelText: string;
  ref?: React.Ref<ComboboxRefActions<T>>;
}

export interface ComboboxRefActions<T> {
  setValueFromRef: (value: T) => void;
}

export const MigrationCombobox = () => {
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [accountList, setAccountList] = useState<ClientLegacyUser[]>([]);

  useEffect(() => {
    getUnmigratedAccounts().then((accounts) => {
      setAccountList(accounts);
    });
  }, []);

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAccount(null);
    setQuery("");
  };

  const filteredAccounts =
    query === ""
      ? accountList
      : accountList.filter(
          (account) =>
            account.name.toLowerCase().includes(query.toLowerCase()) ||
            account.id.toString().includes(query),
        );

  return (
    <Combobox
      value={selectedAccount}
      onChange={setSelectedAccount}
      name="legacyAccountId"
      nullable
    >
      <label className="group flex w-full flex-col gap-1">
        <span className="w-fit cursor-pointer text-sm font-normal text-neutral-500 transition-all group-focus-within:font-medium group-focus-within:text-primary-500 md:text-base">
          Legacy account
        </span>
        <span className="relative w-full">
          <Combobox.Input
            aria-label="Account"
            placeholder="Search for account"
            autoComplete="off"
            displayValue={(id: number) => {
              const account = accountList.find((account) => account.id === id);
              return account ? `#${account.id} - ${account.name}` : "";
            }}
            onChange={(event) => setQuery(event.target.value)}
            className=" flex h-12 w-full items-center justify-between gap-3 rounded-xl border-2 border-neutral-200 bg-white px-4 py-6 text-lg text-neutral-600 shadow-inner outline-none outline-2 transition-all placeholder:text-neutral-400 focus-within:border-primary-300 md:px-6 md:py-8  md:text-2xl lg:px-4 lg:py-7 lg:text-lg"
          />
          <Combobox.Options className="absolute bottom-full flex w-full flex-col rounded-xl border bg-white shadow-inner outline-none outline-2 drop-shadow-md empty:invisible">
            {filteredAccounts.slice(0, 4).map((account) => (
              <Combobox.Option
                key={account.id}
                value={account.id}
                onClick={(e) => e.stopPropagation()}
                className="text-md w-full rounded-xl px-4 py-3 text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100 md:px-6 md:py-8 md:text-2xl lg:px-4 lg:py-4 lg:text-lg"
              >
                #{account.id} - {account.name}
              </Combobox.Option>
            ))}
          </Combobox.Options>
          {selectedAccount && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary-50"
              onClick={reset}
            >
              <HiX className="text-md text-primary-400" />
            </div>
          )}
        </span>
      </label>
    </Combobox>
  );
};
