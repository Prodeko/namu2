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
  resolutionDate: Date | null;
  resolutionMessage: string | null;
  voteCount: number;
  status: "OPEN" | "ACCEPTED" | "REJECTED";
};

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
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  userName: z.string().min(4).max(100),
  pinCode: pinCodeParser,
});

export type CreateAccountCredentials = z.infer<
  typeof createAccountCredentialsParser
>;

export const createAccountFormParser = createAccountCredentialsParser
  .extend({
    confirmPinCode: pinCodeParser,
  })
  .refine((data) => data.pinCode === data.confirmPinCode, {
    message: "PIN codes do not match",
    path: ["confirmPinCode"],
  });

export type CreateAccountFormState = z.infer<typeof createAccountFormParser>;

export const changePinFormParser = z
  .object({
    oldPincode: pinCodeParser,
    newPincode: pinCodeParser,
    confirmNewPincode: pinCodeParser,
  })
  .refine((data) => data.newPincode === data.confirmNewPincode, {
    message: "PIN codes do not match",
    path: ["confirmNewPincode"],
  });

export type ChangePinFormState = z.infer<typeof changePinFormParser>;
export type ChartDataset = {
  label: string;
  data: number[];
  backgroundColor?: string[] | string;
  borderColor?: string[] | string;
  borderWidth?: number;
};

export type NamuStatistic = {
  displayName: string;
  chartType: "bar" | "line";
  getQuery: (product?: string) => string;
};
