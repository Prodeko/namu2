"use client";

import { shopCatalogueID } from "@/common/constants";
import { type CartProduct } from "@/common/types";
import { ProductSection } from "@/components/ui/ProductSection";
import { ShoppingCart } from "@/components/ui/ShoppingCart";
import { Slider } from "@/components/ui/Slider";
import { sections } from "@/state/activeSection";

import { FeaturedSection } from "./FeaturedSection";
import { ShopNav } from "./ShopNav";

const data: CartProduct[] = [
  {
    id: 1,
    name: "Pepsi Max 0.1L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 1,
    stock: 1,
    quantity: 1,
  },
  {
    id: 2,
    name: "Coca Cola 0.2L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 2,
    stock: 2,
    quantity: 2,
  },
  {
    id: 3,
    name: "Fanta 0.3L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 3,
    stock: 3,
    quantity: 3,
  },
  {
    id: 4,
    name: "Jaffa 0.4L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 4,
    stock: 4,
    quantity: 4,
  },
  {
    id: 5,
    name: "Dr. Pepper 0.5L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 5,
    stock: 5,
    quantity: 5,
  },
];

const Shop = () => {
  return (
    <>
      <ShopNav sections={sections} />
      <div
        id={shopCatalogueID}
        className="flex flex-grow flex-col gap-10 bg-neutral-50 pb-48 pt-10"
      >
        <FeaturedSection section={sections.featured} />
        <ProductSection section={sections.drinks} items={data} />
        <ProductSection section={sections.snacks} items={data} />
        <ProductSection section={sections.food} items={data} />
        <div className="fixed bottom-0 left-0 flex w-full gap-4 bg-[linear-gradient(to_top,theme(colors.primary.700/50%),theme(colors.neutral.50/0%))] p-12">
          <Slider />
          <ShoppingCart />
        </div>
      </div>
    </>
  );
};

export default Shop;
