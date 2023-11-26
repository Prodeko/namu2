import { type ComponentProps } from "react"

import { type CartProduct } from "@/common/types"

import { ListItem } from "./ListItem"
import { SectionTitle } from "./SectionTitle"

type DivProps = ComponentProps<"div">

export interface Props extends DivProps {
  categoryName: string
  items: CartProduct[]
}

export const ProductCategory = ({ categoryName, items, ...props }: Props) => {
  return (
    <section {...props} className="flex flex-col gap-2">
      <SectionTitle title={categoryName} />
      <ul className="flex flex-col divide-y-2">
        {items.map((item) => (
          <ListItem
            key={item.id}
            product={item}
            changeItemAmountInCart={() => {}}
          />
        ))}
      </ul>
    </section>
  )
}
