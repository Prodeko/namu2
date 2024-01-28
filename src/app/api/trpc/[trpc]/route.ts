import { headers } from "next/headers";
import { type NextRequest } from "next/server";

import { env } from "@/env.mjs";
import { createTRPCContext } from "@/server/api/context";
import { appRouter } from "@/server/api/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: NextRequest) => {
  const requestHandler = fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        req,
        resHeaders: headers(),
      }),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });
  return requestHandler;
};

export { handler as GET, handler as POST };
