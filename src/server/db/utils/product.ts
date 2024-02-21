import { ClientProduct } from "@/common/types";
import { db } from "@/server/db/prisma";
import { Product } from "@prisma/client";

const parseProduct = (product: Product): ClientProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.sellingPrice.toNumber(),
    imageFilePath: product.imageUrl,
    stock: product.stock,
  };
};

export const getClientProducts = async () => {
  const products = await db.product.findMany();
  return products.map(parseProduct);
};
