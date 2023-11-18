import { z } from "zod";

// Basetypes
const id = z.number();

// Product
const productEnum = z.enum(["drink", "snack", "other", "other"]);

const product = z.object({
  name: z.string().max(50),
  description: z.string().max(500),
  category: productEnum,
  price: z.number().positive(),
});

export { id, product, productEnum };
