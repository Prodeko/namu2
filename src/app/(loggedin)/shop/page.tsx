import { shopCatalogueID } from "@/common/constants";
import { FavoritesSection } from "@/components/ui/FavoritesSection";
import { ProductSection } from "@/components/ui/ProductSection";
import { PurchaseSlider } from "@/components/ui/PurchaseSlider";
import { ShoppingCart } from "@/components/ui/ShoppingCart";
import { getActiveClientProducts } from "@/server/db/queries/product";
import { sections } from "@/state/activeSection";

import { FeaturedSection } from "./FeaturedSection";
import { ShopNav } from "./ShopNav";

const Shop = async () => {
  const products = await getActiveClientProducts();
  const drinks = products.filter((product) => product.category === "DRINK");
  const snacks = products.filter((product) => product.category === "SNACK");
  const food = products.filter((product) => product.category === "FOOD");
  return (
    <>
      <ShopNav sections={sections} />
      <div
        id={shopCatalogueID}
        className="flex w-full flex-grow flex-col gap-10  pb-48 pt-6 md:pt-10 landscape:max-w-screen-lg"
      >
        <FeaturedSection />
        <FavoritesSection />
        <ProductSection section={sections.drinks} items={drinks} />
        <ProductSection section={sections.snacks} items={snacks} />
        <ProductSection section={sections.food} items={food} />
        <div className="fixed left-0 top-[100dvh] flex w-full max-w-[100vw] -translate-y-full flex-col-reverse justify-center gap-2 bg-[linear-gradient(to_top,theme(colors.neutral.700/50%),theme(colors.neutral.50/0%))] px-5 pb-5 md:flex-row md:gap-4 md:p-12">
          <PurchaseSlider />
          <ShoppingCart />
        </div>
      </div>
    </>
  );
};

export default Shop;
