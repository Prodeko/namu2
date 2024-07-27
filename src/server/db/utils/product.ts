import type { ClientProduct } from "@/common/types";
import { db } from "@/server/db/prisma";
import { ProductCategory } from "@prisma/client";

export const getClientProducts = async (): Promise<ClientProduct[]> => {
  const products = await db.product.findMany({
    include: {
      Prices: {
        select: {
          price: true,
        },
        where: {
          isActive: true,
        },
      },
      ProductInventory: {
        select: {
          quantity: true,
        },
        where: {
          isActive: true,
        },
      },
    },
  });

  return products.map((product) => {
    const parsedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category as ProductCategory,
      imageFilePath: product.imageUrl,
      stock: product.ProductInventory[0]?.quantity as number,
      price: product.Prices[0]?.price.toNumber() as number,
    };

    if (parsedProduct.stock === undefined) {
      console.warn(`Product with id ${product.id} has no stock defined`);
    }

    if (parsedProduct.price === undefined) {
      console.warn(`Product with id ${product.id} has no price defined`);
    }

    return parsedProduct;
  });
};
