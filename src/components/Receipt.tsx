"use client";

import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

import { ReceiptProduct } from "@/common/types";

interface Props {
  items?: ReceiptProduct[];
}

const receiptStyles = cva(
  "jagged-border-top fixed bottom-0 left-[10%] flex w-[80vw] max-w-screen-md transform flex-col items-center bg-neutral-50 px-24 py-24 font-mono text-3xl text-neutral-700 shadow-xl transition-transform duration-500 ease-in-out",
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
    setTimeout(() => setVisible(false), 10000);
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
          <div className="flex w-full justify-between" key={item.name}>
            <p>{item.name}</p>
            <p>
              {item.quantity} x {item.singleItemPrice}
            </p>
            <p>{item.totalPrice}</p>
          </div>
        ))}
        <div className="my-6 w-full border-b-2 border-dashed border-neutral-700" />

        <div className="flex w-full justify-between">
          <p>Yhteensä</p>
          <p>{items.reduce((acc, item) => acc + item.totalPrice, 0)}</p>
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
