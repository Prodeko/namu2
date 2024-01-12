import { HiOutlinePlusCircle } from "react-icons/hi";

import { Product } from "@/common/types";

import { Input } from "./Input";

interface Props {
  product?: Product;
}

export const EditProductForm = ({ product }: Props) => {
  return (
    <>
      <h2 className="text-5xl font-semibold text-neutral-700">
        {product ? "Edit product" : "Add new product"}
      </h2>
      <div className="flex w-full gap-6 portrait:flex-col">
        <div className="flex flex-1 flex-col gap-4">
          <Input
            placeholderText={"Coca-Cola"}
            labelText="Name"
            value={product?.name}
          />
          <Input
            type="number"
            placeholderText={"Select category..."}
            labelText="Category"
          />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-3xl bg-white py-10 shadow-sm portrait:w-full landscape:max-w-[20rem] ">
          <HiOutlinePlusCircle className="text-6xl text-primary-400" />
          <p className="text-2xl text-neutral-700 ">Add image</p>
        </div>
      </div>
      <Input
        placeholderText="Product description"
        labelText="Description"
        value={product?.description}
      />
      <Input
        type="number"
        labelText="Price"
        placeholderText="1,50€"
        value={product?.price}
      />
    </>
  );
};
