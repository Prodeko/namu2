import { type ComponentProps } from "react";

import { ListItem } from "./ListItem";

type DivProps = ComponentProps<"div">;

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  amount: number;
}

export interface Props extends DivProps {
  cartItems: Product[];
  setCartItems: (newCartItems: Product[]) => void;
}

export const ShoppingCart = ({ cartItems, setCartItems, ...props }: Props) => {
  const changeItemAmountInCart = (key: number, amount: number) => {
    let newCartItems = [...cartItems];
    newCartItems.map((item) => {
      item.id === key ? (item.amount = amount > 0 ? amount : 0) : item;
    });
    newCartItems = newCartItems.filter((item) => item.amount > 0);
    setCartItems(newCartItems);
  };

  return (
    <div {...props} className="grid gap-6 border-2 p-6">
      <div>
        <div className="text-4xl font-bold text-gray-700">Cart</div>
        <div className="h-96 overflow-auto">
          {"cart items" &&
            cartItems.map((product) => (
              <ListItem
                key={product.id}
                productId={product.id}
                productName={product.name}
                productDescription={product.description}
                stockAmount={product.stock}
                productPrice={product.price}
                itemAmountInCart={product.amount}
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
  );
};
