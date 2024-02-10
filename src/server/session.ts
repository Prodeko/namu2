import { z } from "zod";

import { generateSessionId } from "@/common/cryptography";
import { redisClient } from "@/server/db/redis";
import { type Role } from "@prisma/client";

const sessionDataParser = z.object({
  userId: z.coerce.number(),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
  createdAt: z.string(),
  lastAccessed: z.string(),
  validUntil: z.string(),
});
type Session = z.infer<typeof sessionDataParser>;

/**
 * Namespace for server-side session management.
 */
export namespace ServerSession {
  /**
   * Saves a server-side session to Redis.
   * @param input Input object containing the user id and PIN code.
   * @param durationInMinutes Duration of the session in minutes.
   * @returns Return the server id
   */
  export const SaveSession = async ({
    userId,
    role,
    durationInMinutes,
  }: {
    userId: number;
    role: Role;
    durationInMinutes: number;
  }): Promise<string> => {
    try {
      const sessionId = generateSessionId();
      const createdAt = new Date();
      const durationInMilliseconds = durationInMinutes * 60 * 1000;
      await redisClient.HSET(`session:${sessionId}`, {
        userId,
        role,
        createdAt: createdAt.toISOString(),
        lastAccessed: createdAt.toISOString(),
        validUntil: new Date(
          createdAt.getMilliseconds() + durationInMilliseconds,
        ).toISOString(),
      });
      return sessionId;
    } catch (error) {
      throw new Error("Failed to save session");
    }
  };

  const updateSession = async ({
    sessionId,
    durationInMinutes,
  }: {
    sessionId: string;
    durationInMinutes: number;
  }) => {
    try {
      const lastUpdated = new Date();
      const durationInMilliseconds = durationInMinutes * 60 * 1000;
      const validUntil = new Date(
        lastUpdated.getTime() + durationInMilliseconds,
      );

      await redisClient.HSET(`session:${sessionId}`, {
        lastUpdated: lastUpdated.toISOString(),
        validUntil: validUntil.toISOString(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update session: ${error.message}`);
      }
      throw new Error("Failed to update session");
    }
  };

  /**
   * Validates a server-side session.
   * @param sessionId Session id.
   * @returns Returns the user id.
   */
  export const getSession = async (sessionId: string): Promise<Session> => {
    try {
      const sessionData = await redisClient.HGETALL(`session:${sessionId}`);
      const parsedSessionData = sessionDataParser.parse(sessionData);
      if (!parsedSessionData) {
        throw new Error("Session was not found");
      }

      const now = new Date();
      const validUntil = new Date(parsedSessionData.validUntil);
      if (now > validUntil) {
        throw new Error("Session has expired");
      }

      await updateSession({ sessionId, durationInMinutes: 15 });
      return parsedSessionData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors.flatMap((err) => err.message).join(", "));
      }
      if (error instanceof Error) {
        throw new Error(`Failed to validate session: ${error.message}`);
      }
      throw new Error("Failed to validate session");
    }
  };
}
