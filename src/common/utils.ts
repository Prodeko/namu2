import { clientEnv } from "@/env/client.mjs";

export const createPath = <const PathSuffix extends string>(
  path: PathSuffix,
) => {
  return `${clientEnv.NEXT_PUBLIC_URL}/${path}` as const;
};

export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

/**
 * Throws an error if the code is running on the server.
 * @param errorMessage - The error message to throw.
 */
export const errorOnServerEnvironment = (errorMessage: string) => {
  if (typeof window === "undefined") {
    throw new Error(errorMessage);
  }
};
