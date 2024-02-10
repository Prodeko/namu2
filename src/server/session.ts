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
   * @param userId User id.
   * @param role User role.
   * @param durationInMinutes Session duration in minutes.
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
    const sessionId = generateSessionId();
    const createdAt = new Date();
    const durationInMilliseconds = durationInMinutes * 60 * 1000;
    await redisClient.HSET(`session:${sessionId}`, {
      userId,
      role,
      createdAt: createdAt.toISOString(),
      lastAccessed: createdAt.toISOString(),
      validUntil: new Date(
        createdAt.getTime() + durationInMilliseconds,
      ).toISOString(),
    });
    return sessionId;
  };

  /**
   * Updates a server-side session to extend its validity.
   * @param sessionId Session id.
   * @param durationInMinutes New session duration in minutes.
   */
  const UpdateSession = async ({
    sessionId,
    durationInMinutes,
  }: {
    sessionId: string;
    durationInMinutes: number;
  }) => {
    const lastUpdated = new Date();
    const durationInMilliseconds = durationInMinutes * 60 * 1000;
    const validUntil = new Date(lastUpdated.getTime() + durationInMilliseconds);

    await redisClient.HSET(`session:${sessionId}`, {
      lastUpdated: lastUpdated.toISOString(),
      validUntil: validUntil.toISOString(),
    });
  };

  /**
   * Removes a server-side session from Redis.
   * @param sessionId Session id.
   */
  const RemoveSession = async (sessionId: string) => {
    await redisClient.DEL(`session:${sessionId}`);
  };

  /**
   * Validates a server-side session.
   * @param sessionId Session id.
   * @returns Returns the user id.
   */
  export const GetSession = async (sessionId: string): Promise<Session> => {
    const sessionData = await redisClient.HGETALL(`session:${sessionId}`);
    const parsedSessionData = sessionDataParser.safeParse(sessionData);
    if (!parsedSessionData.success) {
      throw new Error("Session was not found");
    }

    const now = new Date();
    const validUntil = new Date(parsedSessionData.data.validUntil);
    if (now > validUntil) {
      RemoveSession(sessionId);
      throw new Error("Session has expired");
    }

    await UpdateSession({ sessionId, durationInMinutes: 15 });
    return parsedSessionData.data;
  };
}
