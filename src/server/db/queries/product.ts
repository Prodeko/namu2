import { z } from "zod";

import {
  type ClientProduct,
  CreateProductDetails,
  IdParser,
} from "@/common/types";
import { db } from "@/server/db/prisma";
import { ValueError } from "@/server/exceptions/exception";
import type { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const groupedProductParser = z.object({
  categoryName: z.string(),
  nodes: z.array(
    z.object({
      nodeName: z.string(),
      nodeId: IdParser,
    }),
  ),
});
const arrayGroupedProductParser = z.array(groupedProductParser);
type GroupedProduct = z.infer<typeof groupedProductParser>;

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
    category: product.category,
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

export const getProductsGroupedByCategory = async (): Promise<
  | {
      ok: true;
      categories: GroupedProduct[];
    }
  | {
      ok: false;
    }
> => {
  try {
    const result = await db.$queryRaw`
    WITH products AS (
      SELECT "category", "name" as nodeName, "id" as nodeId
      FROM "Product"
      ORDER BY "category", "name"
    )

    SELECT category, JSON_AGG(JSON_BUILD_OBJECT('nodeName', nodeName, 'nodeId', nodeId)) as nodes
    FROM products
    GROUP BY 1
  `;

    const parseResult = arrayGroupedProductParser.safeParse(result);

    if (!parseResult.success) {
      throw new ValueError({
        message: "Failed to parse product categories",
        cause: "invalid_value",
      });
    }
    return { ok: true, categories: parseResult.data };
  } catch (error) {
    if (error instanceof ValueError) {
      console.error(error.toString());
    } else {
      console.error(
        `An error occurred while executing query to fetch product categories: ${error}`,
      );
    }
    return { ok: false };
  }
};

export const createProduct = async ({
  name,
  description,
  category,
  imageFilePath,
  price,
  stock = 0,
}: CreateProductDetails) => {
  return db.product.create({
    data: {
      name,
      description,
      category,
      imageUrl: imageFilePath,
      ProductInventory: {
        create: {
          quantity: stock,
        },
      },
      Prices: {
        create: {
          price: new Decimal(price),
        },
      },
    },
  });
};
