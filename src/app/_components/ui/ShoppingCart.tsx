import { type ComponentProps } from "react"

import { type CartProduct } from "@/common/types"

import { ListItem } from "./ListItem"

type DivProps = ComponentProps<"div">

export interface Props extends DivProps {
  cartItems: CartProduct[]
  setCartItems: (newCartItems: CartProduct[]) => void
}

export const ShoppingCart = ({ cartItems, setCartItems, ...props }: Props) => {
  const changeItemAmountInCart = (key: number, amount: number) => {
    let newCartItems = [...cartItems]
    newCartItems.map((item) => {
      item.id === key ? (item.amount = amount > 0 ? amount : 0) : item
    })
    newCartItems = newCartItems.filter((item) => item.amount > 0)
    setCartItems(newCartItems)
  }

  return (
    <div {...props} className="grid gap-6 border-2 p-6">
      <div>
        <div className="text-4xl font-bold text-gray-700">Cart</div>
        <div className="h-96 overflow-auto">
          {"cart items" &&
            cartItems.map((product) => (
              <ListItem
                key={product.id}
                product={product}
                changeItemAmountInCart={changeItemAmountInCart}
              />
            ))}
        </div>
      </div>
      <div className="inline-flex">
        <span className="text-3xl font-medium text-gray-900">Total:</span>
        &nbsp;
        <span className="text-3xl font-medium text-pink-500">
          {cartItems.reduce((acc, item) => acc + item.price * item.amount, 0)}€
        </span>
      </div>
    </div>
  )
}
