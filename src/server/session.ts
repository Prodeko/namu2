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

type ErrorType =
  | "INTERNAL_SERVER_ERROR"
  | "SESSION_NOT_FOUND"
  | "SESSION_EXPIRED";

interface DataSuccessResponse<T> {
  ok: true;
  data: T;
}

interface SuccessResponse {
  ok: true;
}

interface ErrorResponse {
  ok: false;
  error: {
    type: ErrorType;
    message: string;
  };
}

type DataResponse<T> = DataSuccessResponse<T> | ErrorResponse;
type Response = SuccessResponse | ErrorResponse;

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
  }): Promise<DataResponse<string>> => {
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
          createdAt.getTime() + durationInMilliseconds,
        ).toISOString(),
      });
      return {
        ok: true,
        data: sessionId,
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          type: "INTERNAL_SERVER_ERROR",
          message: "Failed to save session",
        },
      };
    }
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
  }): Promise<DataResponse<Pick<Session, "lastAccessed" | "validUntil">>> => {
    try {
      const lastAccessed = new Date();
      const durationInMilliseconds = durationInMinutes * 60 * 1000;
      const validUntil = new Date(
        lastAccessed.getTime() + durationInMilliseconds,
      );
      const lastAccessedString = lastAccessed.toISOString();
      const validUntilString = validUntil.toISOString();

      await redisClient.HSET(`session:${sessionId}`, {
        lastAccessed: lastAccessedString,
        validUntil: validUntilString,
      });
      return {
        ok: true,
        data: {
          lastAccessed: lastAccessedString,
          validUntil: validUntilString,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          type: "INTERNAL_SERVER_ERROR",
          message: "Failed to update session",
        },
      };
    }
  };

  /**
   * Removes a server-side session from Redis.
   * @param sessionId Session id.
   */
  const RemoveSession = async (sessionId: string): Promise<Response> => {
    try {
      await redisClient.DEL(`session:${sessionId}`);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: {
          type: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove session",
        },
      };
    }
  };

  /**
   * Validates a server-side session.
   * @param sessionId Session id.
   * @returns Returns the user id.
   */
  export const GetSession = async (
    sessionId: string,
  ): Promise<DataResponse<Session>> => {
    try {
      const sessionData = await redisClient.HGETALL(`session:${sessionId}`);
      const parsedSessionData = sessionDataParser.safeParse(sessionData);
      if (!parsedSessionData.success) {
        throw new Error(
          `Error happended while parsing data: ${parsedSessionData.error}`,
        );
      }

      const now = new Date();
      const validUntil = new Date(parsedSessionData.data.validUntil);
      if (now > validUntil) {
        const response = await RemoveSession(sessionId);
        if (!response.ok) {
          throw new Error(response.error.message);
        }
        throw new Error("Session has expired");
      }

      const response = await UpdateSession({
        sessionId,
        durationInMinutes: 15,
      });
      if (!response.ok) {
        throw new Error(response.error.message);
      }
      return {
        ok: true,
        data: {
          ...parsedSessionData.data,
          validUntil: response.data.validUntil,
          lastAccessed: response.data.lastAccessed,
        },
      };
    } catch (error) {
      console.error("Failed to get session: ", error);
      return {
        ok: false,
        error: {
          type: "SESSION_NOT_FOUND",
          message: "Session not found or expired",
        },
      };
    }
  };
}
