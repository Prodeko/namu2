import { HiOutlinePlusCircle, HiOutlineSave, HiX } from "react-icons/hi";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { EditProductForm } from "@/components/ui/EditProductForm";
import { Input } from "@/components/ui/Input";

const NewProduct = () => {
  return (
    <div className="flex w-full max-w-screen-md flex-col gap-8">
      <EditProductForm />
      <div className="flex w-full gap-4">
        <FatButton
          buttonType="a"
          href="/shop"
          text="Cancel"
          intent="secondary"
          RightIcon={HiX}
        />
        <FatButton
          buttonType="a"
          href="/shop"
          text="Save product"
          intent="primary"
          RightIcon={HiOutlineSave}
        />
      </div>
    </div>
  );
};

export default NewProduct;
