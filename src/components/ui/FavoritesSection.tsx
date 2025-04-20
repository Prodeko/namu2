import { Section } from "@/common/types";
import { getFavoriteProducts } from "@/server/actions/account/getFavoriteProducts";

import { ProductSection } from "./ProductSection";

const favSection: Section = {
  id: "section-favorites",
  name: "Favorites",
};
export const FavoritesSection = async () => {
  const favorites = await getFavoriteProducts();
  return <ProductSection section={favSection} items={favorites} />;
};
