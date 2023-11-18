import { type ComponentProps } from "react";

import { ListItem } from "./ListItem";

type DivProps = ComponentProps<"div">;

export interface Props extends DivProps {
  categoryName: string;
  items: Array<[string, number, number]>;
}

export const ProductCategory = ({ categoryName, items, ...props }: Props) => {
  return (
    <div {...props} className="flex-col justify-between gap-5 px-6">
      <p className="text-4xl font-bold">{categoryName}</p>
      {items.map((item) => (
        <ListItem
          key={item[0]}
          productName={item[0]}
          stockAmount={item[1]}
          productPrice={item[2]}
        ></ListItem>
      ))}
    </div>
  );
};
