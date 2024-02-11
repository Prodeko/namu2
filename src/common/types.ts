import { z } from "zod";

// Basetypes
export const IdParser = z.number().int().nonnegative();
export type Id = z.infer<typeof IdParser>;

// Product
export const ProductCategoryParser = z.enum(["FOOD", "DRINK", "SNACK"]);
export type ProductCategory = z.infer<typeof ProductCategoryParser>;

export const ClientProductParser = z.object({ id: IdParser }).extend({
  name: z.string().max(50),
  description: z.string().max(500),
  category: ProductCategoryParser,
  price: z.number().positive(),
  imageFilePath: z.string().url(),
  stock: z.number().int().nonnegative(),
});

export type ClientProduct = z.infer<typeof ClientProductParser>;

export const CartProductParser = ClientProductParser.extend({
  quantity: z.number().int().nonnegative(),
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

export type WishlistFilter = {
  tabname: string;
  filterMethod: (wishlist: WishObject[]) => WishObject[];
};

const pinCodeMinLength = 4;
const pinCodeMaxLength = 10;
export const loginFormParser = z.object({
  userName: z.string(),
  pinCode: z
    .string()
    .regex(/^\d+$/, "Pincode must contain only numerical values")
    .min(
      pinCodeMinLength,
      `Pincode must contain at least ${pinCodeMinLength} values`,
    )
    .max(10, `Pincode must contain at most ${pinCodeMaxLength} values`),
  message: z.string().optional(),
});
export type LoginFormState = z.infer<typeof loginFormParser>;
