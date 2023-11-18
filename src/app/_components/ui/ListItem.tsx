import { type ComponentProps } from "react"
import { useState } from "react"
import { HiMinus, HiPlus } from "react-icons/hi"

import { type CartProduct } from "@/common/types"

type DivProps = ComponentProps<"div">

export interface Props extends DivProps {
  product: CartProduct
  changeItemAmountInCart: (key: number, amount: number) => void
}

export const ListItem = ({
  product,
  changeItemAmountInCart,
  ...props
}: Props) => {
  const [textValue, setTextValue] = useState<number>(product.amount)

  const changeItemAmount = (
    productId: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!isNaN(textValue)) {
      setTextValue(textValue)
      changeItemAmountInCart(productId, textValue)
    } else {
      setTextValue(product.amount)
    }
  }

  const changeTextField = (
    productId: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value === "") {
      setTextValue(NaN)
    } else {
      setTextValue(parseInt(event.target.value, 10))
    }
  }

  return (
    <div {...props} className="flex justify-between border-b-2 py-3">
      <div className="flex-col justify-between gap-3">
        <p className="text-2xl font-bold text-gray-700">{product.name}</p>
        <p className="text-xl font-light text-gray-700">
          {product.description}
          <br />
          In stock: {product.amount}
        </p>
        <p className="text-2xl font-medium text-pink-400">{product.price}€</p>
      </div>
      <div className="flex justify-between gap-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              changeItemAmountInCart(product.id, product.amount - 1)
              setTextValue(product.amount - 1)
            }}
          >
            <HiMinus className="h-12 w-12" />
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
            onClick={() => {
              changeItemAmountInCart(product.id, product.amount + 1)
              setTextValue(product.amount + 1)
            }}
          >
            <HiPlus className="h-12 w-12" />
          </button>
        </div>
        <div className="flex items-center rounded-xl bg-pink-400 p-10">
          Image
        </div>
      </div>
    </div>
  )
}
