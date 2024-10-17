import { shopCatalogueID } from "@/common/constants";
import { ProductSection } from "@/components/ui/ProductSection";
import { PurchaseSlider } from "@/components/ui/PurchaseSlider";
import { ShoppingCart } from "@/components/ui/ShoppingCart";
import { getClientProducts } from "@/server/db/queries/product";
import { sections } from "@/state/activeSection";

import { FeaturedSection } from "./FeaturedSection";
import { ShopNav } from "./ShopNav";

const Shop = async () => {
  const products = await getClientProducts();
  const drinks = products.filter((product) => product.category === "DRINK");
  const snacks = products.filter((product) => product.category === "SNACK");
  const food = products.filter((product) => product.category === "FOOD");
  return (
    <>
      <ShopNav sections={sections} />
      <div
        id={shopCatalogueID}
        className="flex flex-grow flex-col gap-10 bg-neutral-50 pb-48 pt-10"
      >
        <FeaturedSection section={sections.featured} />
        <ProductSection section={sections.drinks} items={drinks} />
        <ProductSection section={sections.snacks} items={snacks} />
        <ProductSection section={sections.food} items={food} />
        <div className="fixed bottom-0 left-0 flex w-full gap-4 bg-[linear-gradient(to_top,theme(colors.neutral.700/50%),theme(colors.neutral.50/0%))] p-12">
          <PurchaseSlider />
          <ShoppingCart />
        </div>
      </div>
    </>
  );
};

export default Shop;
