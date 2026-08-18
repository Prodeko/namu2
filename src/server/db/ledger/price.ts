import type { GenericClient } from "@/server/db/utils/dbTypes";
import { ValueError } from "@/server/exceptions/exception";
import { Prisma } from "@prisma/client";

import { supersedeActiveRow } from "./supersede";

/**
 * Set a product's active price. Supersedes the active `ProductPrice` row.
 * Throws `ValueError` if the product has no price yet; no-ops if the price is
 * unchanged.
 */
const set = (client: GenericClient, productId: number, price: number) =>
  supersedeActiveRow({
    findActive: () =>
      client.productPrice.findFirst({ where: { productId, isActive: true } }),
    nextData: (active) => {
      if (!active) {
        throw new ValueError({
          message: `Product with id ${productId} has no price defined`,
          cause: "missing_value",
        });
      }
      if (active.price.toNumber() === price) return null; // unchanged → skip
      return { price: new Prisma.Decimal(price) };
    },
    closeActive: (active) =>
      client.productPrice.update({
        where: {
          productId_validStart: { productId, validStart: active.validStart },
        },
        data: { isActive: false, validEnd: new Date() },
      }),
    append: (data) =>
      client.productPrice.create({ data: { productId, ...data } }),
  });

export const Price = { set };
