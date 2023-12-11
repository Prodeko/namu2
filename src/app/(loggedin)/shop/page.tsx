"use client";

import { type CartProduct } from "@/common/types";
import { type Section } from "@/common/types";
import { ProductCategory } from "@/components/ui/ProductCategory";
import { ShoppingCart } from "@/components/ui/ShoppingCart";
import Slider from "@/components/ui/Slider";

import { FeaturedSection } from "./FeaturedSection";
import { ShopNav } from "./ShopNav";

const data: CartProduct[] = [
  {
    id: 1,
    name: "test",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 1,
    stock: 1,
    quantity: 1,
  },
  {
    id: 2,
    name: "test2",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 2,
    stock: 2,
    quantity: 2,
  },
  {
    id: 3,
    name: "test3",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 3,
    stock: 3,
    quantity: 3,
  },
  {
    id: 4,
    name: "test4",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 4,
    stock: 4,
    quantity: 4,
  },
  {
    id: 5,
    name: "test5",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 5,
    stock: 5,
    quantity: 5,
  },
];

const Shop = () => {
  const featuredSection: Section = {
    id: "section-featured",
    name: "Featured",
  };
  const drinksSection: Section = {
    id: "section-drinks",
    name: "Drinks",
  };
  const snacksSection: Section = {
    id: "section-snacks",
    name: "Snacks",
  };
  const foodSection: Section = {
    id: "section-food",
    name: "Food",
  };
  const sections: Section[] = [
    featuredSection,
    drinksSection,
    snacksSection,
    foodSection,
  ];

  return (
    <>
      <ShopNav sections={sections} />
      <div className="flex flex-grow flex-col gap-10 bg-neutral-50 pt-10">
        <FeaturedSection section={featuredSection} />
        <ProductCategory section={drinksSection} items={data} />
        <ProductCategory section={snacksSection} items={data} />
        <ProductCategory section={foodSection} items={data} />
        <div className="fixed bottom-0 left-0 flex w-full gap-4 bg-[linear-gradient(to_top,theme(colors.primary.700/50%),theme(colors.neutral.50/0%))] p-12">
          <Slider />
          <ShoppingCart />
        </div>
      </div>
    </>
  );
};

export default Shop;
