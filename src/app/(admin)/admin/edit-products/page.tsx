import { AdminTitle } from "@/components/ui/AdminTitle";
import { getActiveClientProducts } from "@/server/db/queries/product";

import { AdminProductSection } from "./AdminProductSection";

const Restock = async () => {
  const products = await getActiveClientProducts();
  return (
    <div className="no-scrollbar flex h-fit w-full max-w-screen-lg flex-col gap-4 overflow-y-scroll px-0 md:gap-8 lg:w-[80%]">
      <AdminTitle withBackButton title="Products" />
      <AdminProductSection products={products} />
    </div>
  );
};

export default Restock;
