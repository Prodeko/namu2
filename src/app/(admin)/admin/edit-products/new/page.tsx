import { AdminTitle } from "@/components/ui/AdminTitle";
import { EditProductForm } from "@/components/ui/EditProductForm";

const NewProduct = () => {
  return (
    <div className="flex w-full max-w-screen-lg flex-col gap-8 pb-6 lg:w-[80%]">
      <AdminTitle withBackButton title="New product" />
      <div className="px-8">
        <EditProductForm />
      </div>
    </div>
  );
};

export default NewProduct;
