import type { ClientProduct } from "@/common/types";
import { db } from "@/server/db/prisma";
import { ValueError } from "@/server/exceptions/exception";
import { Product, ProductCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const parseProductToClientProduct = (
  product: {
    ProductInventory: {
      quantity: number;
    }[];
    Prices: {
      price: Decimal;
    }[];
  } & Product,
): ClientProduct => {
  const stock = product.ProductInventory[0]?.quantity;
  const price = product.Prices[0]?.price.toNumber();

  if (stock === undefined) {
    throw new ValueError({
      message: `Product with id ${product.id} has no stock defined`,
      cause: "missing_value",
    });
  }

  if (price === undefined) {
    throw new ValueError({
      message: `Product with id ${product.id} has no price defined`,
      cause: "missing_value",
    });
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category as ProductCategory,
    imageFilePath: product.imageUrl,
    stock,
    price,
  };
};

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

  return products.map(parseProductToClientProduct);
};
