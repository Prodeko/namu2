import { env } from "@/env.mjs";

export const createPath = <const PathSuffix extends string>(
  path: PathSuffix,
) => {
  return `${env.NEXT_PUBLIC_URL}/${path}` as const;
};
