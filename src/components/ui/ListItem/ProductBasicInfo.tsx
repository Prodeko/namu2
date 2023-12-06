import { CartProduct } from "@/common/types";

export const BasicInfo = ({ product }: { product: CartProduct }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-2xl font-semibold text-neutral-800">
          {product.name}
        </h3>
        <p className="two-line-ellipsis text-xl font-light text-neutral-600">
          {product.description}
        </p>
      </div>
      <p className="text-primary-400 text-2xl font-semibold">
        {product.price.toFixed(2)} €
      </p>
    </div>
  );
};
