import { CartProduct } from "@/common/types";
import { ShoppingCart } from "@/state/shoppingCart";

export const BasicInfo = ({ product }: { product: CartProduct }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-2xl font-semibold text-neutral-800">
          {ShoppingCart.GetItemById(product.id)?.quantity && (
            <span>{ShoppingCart.GetItemById(product.id)?.quantity} x </span>
          )}
          <span>{product.name}</span>
        </h3>
        <p className="two-line-ellipsis text-xl font-light text-neutral-600">
          {product.description}
        </p>
      </div>
      <p className="text-2xl font-semibold text-primary-400">
        {product.price.toFixed(2)} €
      </p>
    </div>
  );
};
