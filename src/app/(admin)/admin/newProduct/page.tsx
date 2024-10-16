import { HiOutlineSave, HiX } from "react-icons/hi";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { EditProductForm } from "@/components/ui/EditProductForm";

const NewProduct = () => {
  return (
    <div className="flex w-[80%] max-w-screen-lg flex-col gap-8">
      <EditProductForm />
    </div>
  );
};

export default NewProduct;
