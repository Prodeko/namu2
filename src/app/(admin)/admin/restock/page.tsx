"use client";

import { useState } from "react";
import { HiOutlineSave, HiX } from "react-icons/hi";

import { useSlideinAnimation } from "@/animations/useSlideinAnimation";
import { CartProduct } from "@/common/types";
import { AdminTitle } from "@/components/ui/AdminTitle";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { EditProductForm } from "@/components/ui/EditProductForm";
import { Input } from "@/components/ui/Input";
import { ListItem } from "@/components/ui/ListItem";
import * as Dialog from "@radix-ui/react-dialog";
import { animated } from "@react-spring/web";

const data: CartProduct[] = [
  {
    id: 1,
    name: "Pepsi Max 0.1L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 1,
    stock: 1,
    quantity: 1,
  },
  {
    id: 2,
    name: "Coca Cola 0.2L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 2,
    stock: 2,
    quantity: 2,
  },
  {
    id: 3,
    name: "Fanta 0.3L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 3,
    stock: 3,
    quantity: 3,
  },
  {
    id: 4,
    name: "Jaffa 0.4L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 4,
    stock: 4,
    quantity: 4,
  },
  {
    id: 5,
    name: "Dr. Pepper 0.5L",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum  asasasasa",
    category: "drink",
    price: 5,
    stock: 5,
    quantity: 5,
  },
];
const AnimatedDialog = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

const Restock = () => {
  const [productFilter, setProductFilter] = useState<string>("");
  const filteredProducts: CartProduct[] = data.filter((product) => {
    if (!productFilter) return true;
    const nameIncludes = product.name.toLowerCase().includes(productFilter);
    const categoryIncludes = product.category.includes(productFilter);
    return nameIncludes || categoryIncludes;
  });

  const {
    containerAnimation,
    overlayAnimation,
    open,
    setOpen,
    toggleContainer,
  } = useSlideinAnimation();
  return (
    <div className="no-scrollbar flex w-[80%] max-w-screen-lg flex-col gap-8 overflow-y-scroll">
      <AdminTitle title="Products" />
      <div className="flex w-full items-center justify-between gap-8 text-xl text-neutral-800">
        <span className="flex-none text-neutral-500">
          Displaying {filteredProducts.length} of {data.length} products
        </span>
        <Input
          placeholderText="Search by name or category..."
          onChange={(e) => setProductFilter(e.target.value.toLowerCase())}
        />
      </div>
      {filteredProducts.map((product) => (
        <Dialog.Root key={product.id} open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <ListItem hideCartIndicator product={product} />
          </Dialog.Trigger>
          <Dialog.Portal>
            <AnimatedOverlay
              style={overlayAnimation}
              className="fixed inset-0 z-20 bg-black bg-opacity-25"
            />
            <AnimatedDialog
              style={containerAnimation}
              className="fixed top-0 z-20 flex h-full w-full items-center justify-center"
            >
              <div className=" flex flex-col rounded-xl bg-neutral-50 px-20 py-20 shadow-lg portrait:w-[80vw] landscape:w-[50vw] ">
                <div className="flex flex-col gap-8">
                  <EditProductForm product={product} />
                  <Dialog.Close asChild>
                    <div className="flex w-full gap-4 portrait:flex-col">
                      <FatButton
                        buttonType="button"
                        text="Cancel"
                        intent="secondary"
                        RightIcon={HiX}
                      />
                      <FatButton
                        buttonType="button"
                        text="Save product"
                        intent="primary"
                        RightIcon={HiOutlineSave}
                      />
                    </div>
                  </Dialog.Close>
                </div>
              </div>
            </AnimatedDialog>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  );
};

export default Restock;
