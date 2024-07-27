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

export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDateTime = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today.getDate() - 1);
  let datePrefix: string;
  if (date.getDate() === today.getDate()) {
    datePrefix = "Today";
  } else if (date.getDate() === yesterday.getDate()) {
    datePrefix = "Yesterday";
  } else {
    datePrefix = formatDate(date);
  }
  return `${datePrefix} ${formatTime(date)}`;
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
