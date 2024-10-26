import { AdminTitle } from "@/components/ui/AdminTitle";
import { getClientProducts } from "@/server/db/queries/product";

import { AdminProductSection } from "./AdminProductSection";

const Restock = async () => {
  const products = await getClientProducts();
  return (
    <div className="no-scrollbar flex h-fit w-full max-w-screen-lg flex-col gap-8 overflow-y-scroll px-0 lg:w-[80%]">
      <AdminTitle title="Products" />
      <AdminProductSection products={products} />
    </div>
  );
};

export default Restock;
