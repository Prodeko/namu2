import { z } from "zod";

// Basetypes
export const IdParser = z
  .number()
  .int({ message: "An id must be an integer" })
  .nonnegative({ message: "An id must be non-negative" });
export type Id = z.infer<typeof IdParser>;

// Product
export const ProductCategoryParser = z.enum(["FOOD", "DRINK", "SNACK"]);
export type ProductCategory = z.infer<typeof ProductCategoryParser>;

export const ClientProductParser = z.object({ id: IdParser }).extend({
  name: z.string().max(50, { message: "Name must be at most 50 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be at most 500 characters" }),
  category: ProductCategoryParser,
  price: z.number().positive({ message: "Price must be positive" }),
  imageFilePath: z
    .string()
    .url({ message: "Image file path must be a valid URL" }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer" }),
});

export type ClientProduct = z.infer<typeof ClientProductParser>;

export const CartProductParser = ClientProductParser.extend({
  quantity: z
    .number()
    .int({ message: "Product quantity in the card must be an integer" })
    .nonnegative({
      message: "Product quantity in the card must be non-negative",
    }),
});

export type CartProduct = z.infer<typeof CartProductParser>;

export type ReceiptProduct = {
  name: string;
  quantity: number;
  singleItemPrice: number;
  totalPrice: number;
  purchaseDate: Date;
};

export type Section = {
  id: string;
  name: string;
};

export interface WishObject {
  id: number;
  name: string;
  description: string;
  webUrl: string | null;
  wishDate: Date;
  resolutionDate: Date | null;
  resolutionMessage: string | null;
  voteCount: number;
  status: "OPEN" | "ACCEPTED" | "REJECTED";
}

export interface UserWishObject extends WishObject {
  userLikesWish?: boolean;
}

export type WishlistFilter = {
  tabname: string;
  filterMethod: (wishlist: WishObject[]) => WishObject[];
};

const pinCodeMinLength = 4;
const pinCodeMaxLength = 10;
const pinCodeParser = z
  .string()
  .regex(/^\d+$/, "Pincode must contain only numerical values")
  .min(
    pinCodeMinLength,
    `Pincode must contain at least ${pinCodeMinLength} values`,
  )
  .max(10, `Pincode must contain at most ${pinCodeMaxLength} values`);
export const loginFormParser = z.object({
  userName: z.string(),
  pinCode: pinCodeParser,
  message: z.string().optional(),
});
export type LoginFormState = z.infer<typeof loginFormParser>;

export const createAccountCredentialsParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  userName: z.string(),
  pinCode: pinCodeParser,
});

export type CreateAccountCredentials = z.infer<
  typeof createAccountCredentialsParser
>;

export const createAccountFormParser = createAccountCredentialsParser.extend({
  confirmPinCode: pinCodeParser,
  message: z.string().optional(),
});

export type CreateAccountFormState = z.infer<typeof createAccountFormParser>;

export const updateProductDetailsParser = z.object({
  id: z
    .number()
    .positive({ message: "Id must be positive" })
    .int({
      message: "Id must be an integer",
    })
    .nullable()
    .optional(),
  name: z.string(),
  description: z.string(),
  category: ProductCategoryParser,
  price: z.number().positive({ message: "Price must be positive" }),
  imageFilePath: z.string(),
  stock: z
    .number()
    .int({ message: "Stock must be an integer" })
    .nonnegative({ message: "Stock must be non-negative" }),
});

export type UpdateProductDetails = z.infer<typeof updateProductDetailsParser>;

export const updateProductFormParser = updateProductDetailsParser.extend({
  message: z.string().optional(),
});

export type UpdateProductFormState = z.infer<typeof updateProductFormParser>;

export const changePinFormParser = z.object({
  oldPincode: pinCodeParser,
  newPincode: pinCodeParser,
  confirmNewPincode: pinCodeParser,
  message: z.string().optional(),
});

export type ChangePinFormState = z.infer<typeof changePinFormParser>;
export type ChartDataset = {
  label: string;
  data: number[];
  backgroundColor?: string[] | string;
  borderColor?: string[] | string;
  borderWidth?: number;
};

export type ChartType = "Bar" | "Line";

export const timeFrameParser = z.enum(["day", "week", "month", "allTime"]);
export type Timeframe = z.infer<typeof timeFrameParser>;

export type NonEmptyArray<T> = readonly [T, ...T[]];

export interface FavouriteProduct {
  name: string;
  imageUrl: string;
  totalQuantity: number;
}
