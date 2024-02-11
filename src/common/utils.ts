import { env } from "@/env.mjs";

export const createPath = (path: string) => {
  return `${env.NEXT_PUBLIC_URL}/${path}`;
};
