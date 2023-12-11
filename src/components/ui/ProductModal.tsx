import Image from "next/image";
import { useState } from "react";
import {
  HiArchiveBox,
  HiCurrencyEuro,
  HiHeart,
  HiOutlineHeart,
  HiXMark,
} from "react-icons/hi2";

import { CartProduct } from "@/common/types";
import { ShoppingCart } from "@/state/shoppingCart";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toggle from "@radix-ui/react-toggle";

import { ButtonGroup } from "./Buttons/ButtonGroup";
import { FatButton } from "./Buttons/FatButton";
import { IconButton } from "./Buttons/IconButton";
import { InfoCard } from "./InfoCard";
import { ListItem } from "./ListItem";

interface Props {
  product: CartProduct;
}

export const ProductModal = ({ product }: Props) => {
  const [favourited, setFavourited] = useState<boolean>(false); // Change to server side
  const [numberOfItems, setNumberOfItems] = useState<number>(0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <ListItem product={product} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
        <Dialog.Content className="fixed top-8 z-20 flex h-[calc(100%-2rem)] w-full flex-col overflow-hidden rounded-t-2xl">
          <div className="relative h-full w-full">
            <Dialog.Close asChild>
              <IconButton
                className="absolute left-12 top-12 z-20"
                buttonType="button"
                Icon={HiXMark}
                sizing="md"
                onClick={() =>
                  setNumberOfItems(
                    ShoppingCart.GetItemById(product.id)?.quantity || 1,
                  )
                }
              />
            </Dialog.Close>
            <Image
              src="/pepsi.jpg"
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="h-full w-full"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
          </div>
          <div className="flex flex-col gap-8 bg-white p-12">
            <div className="flex gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-4xl font-bold text-neutral-700">
                    {product.name}
                  </h3>
                  <Toggle.Root
                    onPressedChange={(prev) => setFavourited(!prev)}
                    asChild
                  >
                    <IconButton
                      buttonType="button"
                      sizing="sm"
                      Icon={favourited ? HiHeart : HiOutlineHeart}
                    />
                  </Toggle.Root>
                </div>
                <p className="text-2xl font-light text-slate-700">
                  {product.description}
                </p>
              </div>
              <div className="flex h-full w-full flex-col gap-6">
                <InfoCard
                  title="price"
                  data={`${product.price} €`}
                  Icon={HiCurrencyEuro}
                />
                <InfoCard
                  title="stock"
                  data={`${product.stock} items`}
                  Icon={HiArchiveBox}
                />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex items-center justify-center rounded-lg border-[3px] border-primary-300 bg-primary-200 px-6 py-4">
                <ButtonGroup
                  leftButtonAction={() =>
                    setNumberOfItems((prev) => Math.max(0, prev - 1))
                  }
                  rightButtonAction={() => setNumberOfItems((prev) => prev + 1)}
                  inputValue={numberOfItems}
                  onInputChange={(newQuantity) => setNumberOfItems(newQuantity)}
                />
              </div>
              <Dialog.Close asChild>
                <FatButton
                  intent={"primary"}
                  buttonType="button"
                  text={`Add to cart ${(product.price * numberOfItems).toFixed(
                    2,
                  )} €`}
                  fullwidth
                  onClick={() => {
                    ShoppingCart.addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: numberOfItems,
                      category: product.category,
                      description: product.description,
                      stock: product.stock,
                    });
                  }}
                />
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};