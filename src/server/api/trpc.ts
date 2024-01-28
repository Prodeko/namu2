import superjson from "superjson";
import { ZodError } from "zod";

import { createTRPCContext } from "@/server/api/context";
import { ServerSession } from "@/server/session";
import { TRPCError, initTRPC } from "@trpc/server";

/**
 * INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : error,
      },
    };
  },
});

export const authMiddleware = t.middleware(async (opts) => {
  const { ctx } = opts;
  console.log("TRYING AUTH");
  if (!ctx.sessionId) {
    console.info("Request unauthorized", { opts });
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session id was not found",
    });
  }
  console.log("YEEESS SIR");

  const userId = await ServerSession.ValidateSession(ctx.sessionId);
  const user = await ctx.db.user.findUnique({ where: { id: userId } });

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

// export const adminMiddleware = authProcedure
/**
 * ROUTER & PROCEDURE
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Authenticated procedure - user
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is an authorized user, and you can access user session data.
 */
export const authProcedure = publicProcedure.use(authMiddleware);

/**
 * Authenticated procedure - admin
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is an authorized admin, and you can access user session data.
 */
export const adminProcedure = authProcedure.meta({ role: "admin" });

/**
 * Authenticated procedure - superadmin
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is an authorized superadmin, and you can access user session data.
 */
export const superadminProcedure = authProcedure.meta({ role: "superadmin" });
