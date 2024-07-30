import { AdminTitle } from "@/components/ui/AdminTitle";
import { getClientProducts } from "@/server/db/queries/product";

import { AdminProductSection } from "./AdminProductSection";

const Restock = async () => {
  const products = await getClientProducts();
  return (
    <div className="no-scrollbar flex w-[80%] max-w-screen-lg flex-col gap-8 overflow-y-scroll">
      <AdminTitle title="Products" />
      <AdminProductSection products={products} />
    </div>
  );
};

export default Restock;
