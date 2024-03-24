import { env } from "@/env.mjs";

export const createPath = <const PathSuffix extends string>(
  path: PathSuffix,
) => {
  return `${env.NEXT_PUBLIC_URL}/${path}` as const;
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
