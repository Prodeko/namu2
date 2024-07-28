import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { serverEnv } from "@/env/server.mjs";
import { InvalidSessionError } from "@/server/exceptions/exception";
import { User } from "@prisma/client";

const sessionDataParser = z.object({
  user: z.object({
    userId: z.coerce.number(),
    role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
    createdAt: z.string(),
  }),
});
export type Session = z.infer<typeof sessionDataParser>;

/**
 * Configuration for the Iron session.
 */
const ironConfig: SessionOptions = {
  password: serverEnv.IRON_SESSION_PASSWORD,
  cookieName: "iron-session",
  cookieOptions: {
    secure: serverEnv.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
  /* TTL is computed in second */
  // ttl: 60 * 60,
};

/**
 * Get the current Iron session, internal use only!
 */
const __GET_SESSION__ = () => getIronSession<Session>(cookies(), ironConfig);

/**
 * Gets the current Iron session and updates its timestamps. Can be used in Server Components, Server Actions and Route Handlers.
 * @param user User to create session for.
 */
const createSession = async (user: User): Promise<Session | undefined> => {
  try {
    const session = await __GET_SESSION__();
    const currentTime = new Date();
    const updatedUser = {
      userId: user.id,
      role: user.role,
      createdAt: currentTime.toISOString(),
    };
    session.user = updatedUser;
    await session.save();
    return session;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to create session: ${error.message}`);
    } else {
      console.error("Failed to create session");
    }
  }
};

/**
 * Removes an Iron session.
 * @param session Session to remove.
 */
const removeSession = async (): Promise<void> => {
  try {
    const session = await __GET_SESSION__();
    session.destroy();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to remove session: ${error.message}`);
    } else {
      console.error("Failed to remove session");
    }
  }
};

/**
 * Get the current Iron session and updates its timestamps.
 */
const getSession = async (): Promise<Session | undefined> => {
  try {
    const session = await __GET_SESSION__();
    if (!session.user) {
      throw new InvalidSessionError({
        cause: "missing_role",
        message: "Session user role is missing",
      });
    }
    return session;
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else if (error instanceof Error) {
      console.error(`Failed to get session: ${error.message}`);
    } else {
      console.error("Failed to get session");
    }
  }
};

const getSessionFromRequest = async (
  req: NextRequest,
  res: NextResponse,
): Promise<Session | undefined> => {
  try {
    const session = await getIronSession<Session>(req, res, ironConfig);
    if (!session.user) {
      throw new InvalidSessionError({
        cause: "missing_role",
        message: "Session user role is missing",
      });
    }
    return session;
  } catch (error) {
    if (error instanceof InvalidSessionError) {
      console.error(error.toString());
    } else if (error instanceof Error) {
      console.error(`Failed to get session: ${error.message}`);
    } else {
      console.error("Failed to get session");
    }
  }
};

export { createSession, getSession, removeSession, getSessionFromRequest };
