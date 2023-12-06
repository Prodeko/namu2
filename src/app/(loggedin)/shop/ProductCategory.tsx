import { type ComponentProps, Fragment } from "react";

import { type Product as ProductType } from "@/common/types";
import Divider from "@/components/ui/Divider";
import { SectionTitle } from "@/components/ui/SectionTitle";

import { Product } from "./Product";

type DivProps = ComponentProps<"div">;

export interface Props extends DivProps {
  name: string;
  products: ProductType[];
}

export const ProductCategory = ({ name, products }: Props) => {
  if (products.length === 0) return null;
  return (
    <div className="category flex scroll-m-20 flex-col gap-4">
      <SectionTitle title={name} />
      <div>
        {products.map((product) => (
          <Fragment key={product.id}>
            <div>
              <Product
                name={product.name}
                price={product.price}
                description={product.description}
                imageFile={product.imageFilePath}
              />
            </div>
            <Divider />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
