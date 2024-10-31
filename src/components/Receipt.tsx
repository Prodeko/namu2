"use client";

import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

import { ReceiptProduct } from "@/common/types";
import { formatCurrency } from "@/common/utils";

interface Props {
  items?: ReceiptProduct[];
}

const receiptStyles = cva(
  "jagged-border-top text-md fixed bottom-0 left-[5%] flex w-[90vw] max-w-screen-md transform flex-col items-center bg-neutral-50 px-8 py-10 font-mono text-neutral-700 shadow-xl transition-transform duration-500 ease-in-out md:left-[10%] md:w-[80vw] md:px-24 md:py-24 md:text-3xl",
  {
    variants: {
      visible: {
        true: "translate-y-0",
        false: "translate-y-full",
      },
    },
  },
);

const bgStyles = cva(
  "fixed inset-0 bg-black transition-opacity duration-700 ease-out",
  {
    variants: {
      visible: {
        true: "opacity-50", // Semi-transparent black background when visible
        false: "pointer-events-none opacity-0", // Transparent and non-interactive when not visible
      },
    },
  },
);

export const Receipt = ({ items = [] }: Props) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 500);
    setTimeout(() => setVisible(false), 8000);
  }, []);
  return (
    <>
      <div
        className={bgStyles({ visible })}
        onTouchEnd={() => setVisible(false)}
      />
      <div className={receiptStyles({ visible })}>
        <p>Namu Oy</p>
        <p>Maarintie 8</p>
        <p>02150 Otaniemi</p>
        <p>Asiakkaan kuitti</p>
        <div className="my-6 w-full border-b-2 border-dashed border-neutral-700" />
        <p>Ostokset</p>

        {items.map((item) => (
          <div className="grid w-full grid-cols-7" key={item.name}>
            <p className="col-span-3">{item.name}</p>
            <p className="col-span-3">
              {item.quantity} x{" "}
              {formatCurrency(item.singleItemPrice).slice(0, -2)}
            </p>
            <p className="justify-self-end">
              {formatCurrency(item.totalPrice).slice(0, -2)}
            </p>
          </div>
        ))}
        <div className="my-6 w-full border-b-2 border-dashed border-neutral-700" />

        <div className="flex w-full justify-between">
          <p>Yhteensä</p>
          <p>
            {formatCurrency(
              items.reduce((acc, item) => acc + item.totalPrice, 0),
            )}
          </p>
        </div>
        <div className="my-6 w-full border-b-2 border-dashed border-neutral-700" />
        <p>Ostettu {items[0]?.purchaseDate.getTime()}</p>
        <p>KIITOS KÄYNNISTÄ</p>
        <p>TERVETULOA UUDELLEEN</p>
        <p>Myyjä: Namu CEO</p>
      </div>
    </>
  );
};
