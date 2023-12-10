import { z } from "zod";

// Basetypes
export const IdParser = z.number().int().nonnegative();
export type Id = z.infer<typeof IdParser>;

// Product
export const ProductCategoryParser = z.enum(["drink", "snack", "other"]);
export type ProductCategory = z.infer<typeof ProductCategoryParser>;

const BaseProductParser = z.object({ id: IdParser }).extend({
  name: z.string().max(50),
  description: z.string().max(500),
  category: ProductCategoryParser,
  price: z.number().positive(),
});

export const ProductParser = BaseProductParser.extend({
  imageFilePath: z.string().url(),
});
export type Product = z.infer<typeof ProductParser>;

export const CartProductParser = BaseProductParser.extend({
  stock: z.number().int().nonnegative(),
  amount: z.number().int().nonnegative(),
});
export type CartProduct = z.infer<typeof CartProductParser>;

export type Section = {
  id: string;
  name: string;
};

export type WishObject = {
  id: number;
  name: string;
  wishDate: Date;
  voteCount: number;
  closed: boolean;
};
