import { type ComponentProps } from "react";
import { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

import { type CartProduct } from "@/common/types";

export interface Props extends ComponentProps<"li"> {
  product: CartProduct;
  changeItemAmountInCart: (key: number, amount: number) => void;
}

export const ListItem = ({
  product,
  changeItemAmountInCart,
  ...props
}: Props) => {
  const [textValue, setTextValue] = useState<number>(product.amount);

  const changeItemAmount = (
    productId: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!Number.isNaN(textValue)) {
      setTextValue(textValue);
      changeItemAmountInCart(productId, textValue);
    } else {
      setTextValue(product.amount);
    }
  };

  const changeTextField = (
    productId: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value === "") {
      setTextValue(NaN);
    } else {
      setTextValue(parseInt(event.target.value, 10));
    }
  };

  return (
    <li {...props} className="flex justify-between py-4">
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col">
          <h4 className="text-2xl font-semibold text-slate-900">
            {product.name}
          </h4>
          <p className="text-xl font-light text-slate-600">
            {product.description}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-2xl font-medium text-pink-400">{product.price}€</p>
          <span className="text-slate-600">In stock: {product.amount}</span>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              changeItemAmountInCart(product.id, product.amount - 1);
              setTextValue(product.amount - 1);
            }}
          >
            <HiMinus className="h-7 w-7" />
          </button>
          {/* <div className="flex h-12 w-12 items-center justify-center rounded bg-pink-100 text-center text-2xl font-medium text-pink-900">
          </div> */}
          <input
            type="number"
            value={textValue}
            onChange={(event) => changeTextField(product.id, event)}
            onBlur={(event) => changeItemAmount(product.id, event)}
            className="flex h-12 w-12 appearance-none items-center justify-center rounded bg-pink-100 text-center text-2xl font-medium text-pink-900 outline-pink-700"
          />
          <button
            type="button"
            onClick={() => {
              changeItemAmountInCart(product.id, product.amount + 1);
              setTextValue(product.amount + 1);
            }}
          >
            <HiPlus className="h-7 w-7" />
          </button>
        </div>
        <div className="flex items-center rounded-xl bg-pink-400 p-10">
          Image
        </div>
      </div>
    </li>
  );
};
