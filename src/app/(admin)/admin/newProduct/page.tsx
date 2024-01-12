import { HiOutlineSave, HiX } from "react-icons/hi";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { EditProductForm } from "@/components/ui/EditProductForm";

const NewProduct = () => {
  return (
    <div className="flex w-[80%] max-w-screen-lg flex-col gap-8">
      <EditProductForm />
      <div className="flex w-full gap-6 portrait:flex-col ">
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
