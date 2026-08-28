import { shopCatalogueID } from "@/common/constants";
import { PurchaseSlider } from "@/components/ui/PurchaseSlider";
import { ShoppingCart } from "@/components/ui/ShoppingCart";
import { getFavoriteProducts } from "@/server/actions/account/getFavoriteProducts";
import { getActiveClientProducts } from "@/server/db/queries/product";
import { sections } from "@/state/activeSection";

import { AnnouncementRunner } from "./AnnouncementRunner";
import { FeaturedSection } from "./FeaturedSection";
import { ShopCatalogue } from "./ShopCatalogue";
import { ShopNav } from "./ShopNav";

const Shop = async () => {
  const [products, favorites] = await Promise.all([
    getActiveClientProducts(),
    getFavoriteProducts(),
  ]);
  return (
    <>
      <ShopNav sections={sections} />
      <AnnouncementRunner />
      <div
        id={shopCatalogueID}
        className="flex w-full flex-grow flex-col gap-10  pb-48 pt-6 md:pt-10 landscape:max-w-screen-lg"
      >
        <FeaturedSection />
        <ShopCatalogue products={products} favorites={favorites} />
        <div className="fixed left-0 top-[100dvh] flex w-full max-w-[100vw] -translate-y-full flex-col-reverse justify-center gap-2 bg-[linear-gradient(to_top,theme(colors.neutral.700/50%),theme(colors.neutral.50/0%))] px-5 pb-5 md:flex-row md:gap-4 md:p-12">
          <PurchaseSlider />
          <ShoppingCart />
        </div>
      </div>
    </>
  );
};

export default Shop;
