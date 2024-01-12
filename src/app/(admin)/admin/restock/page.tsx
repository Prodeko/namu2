"use client";

import { HiOutlineSave, HiX } from "react-icons/hi";

import { useSlideinAnimation } from "@/animations/useSlideinAnimation";
import { CartProduct } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { EditProductForm } from "@/components/ui/EditProductForm";
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
  const {
    containerAnimation,
    overlayAnimation,
    open,
    setOpen,
    toggleContainer,
  } = useSlideinAnimation();
  return (
    <div className="flex w-full max-w-screen-md flex-col gap-8">
      <h2 className="text-5xl font-semibold text-neutral-700">
        Products
        {/* TODO: component */}
      </h2>
      {data.map((product) => (
        <Dialog.Root key={product.id} open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <ListItem product={product} />
          </Dialog.Trigger>
          <Dialog.Portal>
            <AnimatedOverlay
              style={overlayAnimation}
              className="fixed inset-0 bg-black bg-opacity-25"
            />
            <AnimatedDialog
              style={containerAnimation}
              className="fixed top-0 flex h-full w-full items-center justify-center"
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
