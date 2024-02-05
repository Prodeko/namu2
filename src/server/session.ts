import { z } from "zod";

import { generateSessionId } from "@/common/cryptography";
import { IdParser } from "@/common/types";

import { redisClient } from "./db/redis";

export const loginInputParser = z.object({
  userName: z.string().min(1),
  pinCode: IdParser,
});

const sessionDataParser = z.object({
  userId: z.coerce.number(),
  createdAt: z.string(),
  validUntil: z.string(),
});

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
  export const SaveSession = async (
    userId: number,
    durationInMinutes: number,
  ): Promise<string> => {
    try {
      const sessionId = generateSessionId();
      const createdAt = new Date();
      const durationInMilliseconds = durationInMinutes * 60 * 1000;
      await redisClient.HSET(`session:${sessionId}`, {
        userId,
        createdAt: createdAt.toISOString(),
        validUntil: new Date(
          createdAt.getMilliseconds() + durationInMilliseconds,
        ).toISOString(),
      });
      return sessionId;
    } catch (error) {
      throw new Error("Failed to save session");
    }
  };

  /**
   * Validates a server-side session.
   * @param sessionId Session id.
   * @returns Returns the user id.
   */
  export const ValidateSession = async (sessionId: string): Promise<number> => {
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
    return parsedSessionData.userId;
  };
}
