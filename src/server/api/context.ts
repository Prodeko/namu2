import { type RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

import { db } from "@/server/db/prisma";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const getCookie = (name: string): RequestCookie | undefined => {
  const readOnlyCookies = cookies();
  return readOnlyCookies.get(name);
};

export function setCookie(
  resHeaders: FetchCreateContextFnOptions["resHeaders"],
  name: string,
  value: string,
  options: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    sameSite?: "Strict" | "Lax" | "None";
  } = {},
) {
  let cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.maxAge) {
    cookieValue += `; MaxAge=${options.maxAge}`;
  }
  if (options.httpOnly) {
    cookieValue += "; HttpOnly";
  }
  if (options.secure) {
    cookieValue += "; Secure";
  }
  if (options.path) {
    cookieValue += `; Path=${options.path}`;
  }
  if (options.sameSite) {
    cookieValue += `; SameSite=${options.sameSite}`;
  }

  resHeaders.append("Set-Cookie", cookieValue);
}

/**
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface ContextOptions {
  requestHeaders: FetchCreateContextFnOptions["req"]["headers"];
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = () => {
  return { db };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (opts: FetchCreateContextFnOptions) => {
  const innerContext = createInnerTRPCContext();
  const context = {
    ...innerContext,
    req: opts.req,
    resHeaders: opts.resHeaders,
    sessionId: opts.req.headers.get("cookie"),
  };
  // console.log("CONTEXT INPUT OPTIONS", opts);
  console.log("CONTEXT", context);

  return context;
};
