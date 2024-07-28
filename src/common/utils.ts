import { date } from "zod";

import { clientEnv } from "@/env/client.mjs";
import { ValueError } from "@/server/exceptions/exception";

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

export const formatCleverDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.getDate() === today.getDate()) {
    return "Today";
  }
  if (date.getDate() === yesterday.getDate()) {
    return "Yesterday";
  }
  return formatDate(date);
};

export const formatCleverDateTime = (date: Date): string => {
  const datePrefix = formatCleverDate(date);
  return `${datePrefix} ${formatTime(date)}`;
};

export const parseISOString = (s: string) => {
  const b = s.split(/\D+/);
  const [year, month, day, hours, minutes, seconds, milliseconds] = b;

  if (!year || year.length !== 4) {
    throw new ValueError({
      cause: "invalid_value",
      message: `Invalid year value: ${year}`,
    });
  }

  if (!month || month.length !== 2) {
    throw new ValueError({
      cause: "invalid_value",
      message: `Invalid month value: ${month}`,
    });
  }

  if (!day || day.length !== 2) {
    throw new ValueError({
      cause: "invalid_value",
      message: `Invalid day value: ${day}`,
    });
  }

  if (!hours || hours.length !== 2) {
    throw new ValueError({
      cause: "invalid_value",
      message: `Invalid hours value: ${hours}`,
    });
  }

  if (!minutes || minutes.length !== 2) {
    throw new ValueError({
      cause: "invalid_value",
      message: `Invalid minutes value: ${minutes}`,
    });
  }

  if (!seconds || seconds.length !== 2) {
    throw new ValueError({
      cause: "invalid_value",
      message: `Invalid seconds value: ${seconds}`,
    });
  }

  if (!milliseconds || milliseconds.length !== 3) {
    throw new ValueError({
      cause: "invalid_value",
      message: `Invalid milliseconds value: ${milliseconds}`,
    });
  }

  return new Date(
    Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds),
      parseInt(milliseconds),
    ),
  );
};
