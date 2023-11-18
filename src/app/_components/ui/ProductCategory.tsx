import { type ComponentProps } from "react"

import { type CartProduct } from "@/common/types"

import { ListItem } from "./ListItem"

type DivProps = ComponentProps<"div">

export interface Props extends DivProps {
  categoryName: string
  items: CartProduct[]
}

export const ProductCategory = ({ categoryName, items, ...props }: Props) => {
  return (
    <div {...props} className="flex-col justify-between gap-5 px-6">
      <p className="text-4xl font-bold">{categoryName}</p>
      {items.map((item) => (
        <ListItem
          key={item.id}
          product={item}
          changeItemAmountInCart={}
        ></ListItem>
      ))}
    </div>
  )
}
