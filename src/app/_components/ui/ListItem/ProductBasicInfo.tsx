import { CartProduct } from "@/common/types";

export const BasicInfo = ({ product }: { product: CartProduct }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-2xl font-semibold text-slate-800">
          {product.name}
        </h3>
        <p className="text-xl font-light text-slate-600 two-line-ellipsis">
          {product.description}
        </p>
      </div>
      <p className="text-2xl font-semibold text-pink-400">
        {product.price.toFixed(2)} €
      </p>
    </div>
  );
};
