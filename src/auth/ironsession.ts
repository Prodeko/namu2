import { IronSession, SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "@/env.mjs";
import { User } from "@prisma/client";

const sessionDataParser = z.object({
  user: z.object({
    userId: z.coerce.number(),
    role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
    createdAt: z.string(),
    lastAccessed: z.string(),
    validUntil: z.string(),
  }),
});
type Session = z.infer<typeof sessionDataParser>;

/**
 * Configuration for the Iron session.
 */
const ironConfig: SessionOptions = {
  password: env.IRON_SESSION_PASSWORD,
  cookieName: "iron-session",
  cookieOptions: {
    secure: env.NODE_ENV === "production",
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

const createSession = async (user: User, durationInMinutes: number) => {
  try {
    const session = await __GET_SESSION__();
    const currentTime = new Date();
    session.user = {
      userId: user.id,
      role: user.role,
      createdAt: currentTime.toISOString(),
      lastAccessed: currentTime.toISOString(),
      validUntil: new Date(
        currentTime.getTime() + durationInMinutes * 60 * 1000,
      ).toISOString(),
    };
    await session.save();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
    throw new Error("Failed to create session");
  }
};

/**
 * Updates an Iron session with updated timestamps.
 * @param session Session to update.
 * @param durationInMinutes New duration in minutes.
 */
const updateSession = async (
  session: IronSession<Session>,
  durationInMinutes: number,
) => {
  try {
    if (!session.user) {
      throw new Error("Session user is missing");
    }
    const currentTime = new Date();
    session.user = {
      ...session.user,
      lastAccessed: currentTime.toISOString(),
      validUntil: new Date(
        currentTime.getTime() + durationInMinutes * 60 * 1000,
      ).toISOString(),
    };
    await session.save();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update session: ${error.message}`);
    }
    throw new Error("Failed to update session");
  }
};

/**
 * Removes an Iron session.
 * @param session Session to remove.
 */
const removeSession = async () => {
  try {
    const session = await __GET_SESSION__();
    session.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove session: ${error.message}`);
    }
    throw new Error("Failed to remove session");
  }
};

/**
 * Get the current Iron session and updates its timestamps.
 */
const getSession = async () => {
  try {
    const session = await __GET_SESSION__();
    if (!session.user) {
      throw new Error("Session user is missing");
    }

    const now = new Date();
    const validUntil = new Date(session.user.validUntil);
    if (now > validUntil) {
      removeSession();
    }
    const durationInMinutes = 15;
    await updateSession(session, durationInMinutes);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get session: ${error.message}`);
    }
    throw new Error("Failed to get session");
  }
};

export { createSession, getSession, removeSession };
