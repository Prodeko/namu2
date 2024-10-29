"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import {
  HiArchiveBox,
  HiCurrencyEuro,
  HiHeart,
  HiOutlineHeart,
} from "react-icons/hi2";

import { ClientProduct } from "@/common/types";
import { formatCurrency } from "@/common/utils";
import { AnimatedModal } from "@/components/ui/AnimatedModal";
import { ButtonGroup } from "@/components/ui/Buttons/ButtonGroup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { InfoCard } from "@/components/ui/InfoCard";
import { ListItem } from "@/components/ui/ListItem";
import { useShoppingCart } from "@/state/useShoppingCart";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toggle from "@radix-ui/react-toggle";
import { useIsClient } from "@uidotdev/usehooks";

interface Props {
  product: ClientProduct;
}

export const ProductModal = ({ product }: Props) => {
  const [favourited, setFavourited] = useState<boolean>(false); // Change to server side
  const [numberOfItems, setNumberOfItems] = useState<number>(1);
  const { updateCart, hasItem } = useShoppingCart();
  const isClient = useIsClient();

  return (
    <AnimatedModal
      intent="full"
      TriggerComponent={<ListItem product={product} />}
    >
      <div className="relative h-full w-full">
        <Dialog.Close asChild>
          <IconButton
            className="absolute left-12 top-12 z-20"
            buttonType="button"
            Icon={HiX}
            sizing="md"
          />
        </Dialog.Close>
        <Image
          src={product.imageFilePath}
          alt={product.name}
          style={{ objectFit: "cover" }}
          className="h-full w-full"
          fill
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
                onPressedChange={(prev) => setFavourited(prev)}
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
              data={formatCurrency(product.price)}
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
                setNumberOfItems((prev) => Math.max(1, prev - 1))
              }
              rightButtonAction={() => setNumberOfItems((prev) => prev + 1)}
              inputValue={numberOfItems}
              onInputChange={(newQuantity) => setNumberOfItems(newQuantity)}
              maxValue={product.stock}
            />
          </div>
          <Dialog.Close asChild>
            <FatButton
              intent={"primary"}
              buttonType="button"
              text={`${
                isClient && hasItem(product) ? "Update cart" : "Add to cart"
              } ${(product.price * numberOfItems).toFixed(2)} €`}
              fullwidth
              onClick={() => {
                updateCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: numberOfItems,
                  imageFilePath: product.imageFilePath,
                  category: product.category,
                  description: product.description,
                  stock: product.stock,
                });
              }}
            />
          </Dialog.Close>
        </div>
      </div>
    </AnimatedModal>
  );
};
