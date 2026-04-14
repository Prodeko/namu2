import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Keycloak from "next-auth/providers/keycloak";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { loginFormParser } from "@/common/types";
import { db } from "@/server/db/prisma";
import { verifyPincode } from "@/server/db/utils/auth";
import { DeviceType, LoginMethod } from "@prisma/client";

const limiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

const getClientIp = (req: unknown): string => {
  if (!req || typeof req !== "object") {
    return "anonymous";
  }

  const requestLike = req as {
    headers?: Headers | Record<string, string | string[] | undefined>;
  };

  if (requestLike.headers instanceof Headers) {
    const forwardedFor = requestLike.headers.get("x-forwarded-for");
    return forwardedFor?.split(",")[0]?.trim() || "anonymous";
  }

  const rawForwardedFor = requestLike.headers?.["x-forwarded-for"];
  if (Array.isArray(rawForwardedFor)) {
    return rawForwardedFor[0]?.split(",")[0]?.trim() || "anonymous";
  }
  if (typeof rawForwardedFor === "string") {
    return rawForwardedFor.split(",")[0]?.trim() || "anonymous";
  }

  return "anonymous";
};

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Namu Credentials",
      credentials: {
        userName: { label: "Namu ID", type: "text" },
        pinCode: { label: "Pin Code", type: "password" },
        deviceType: { label: "Device Type", type: "text" },
        adminOnly: { label: "Admin Login", type: "text" },
      },
      async authorize(credentials, req) {
        const clientIp = getClientIp(req);
        const limitResult = await limiter.consume(clientIp).catch(() => null);
        if (!limitResult) {
          return null;
        }

        const input = loginFormParser.safeParse({
          userName: credentials?.userName,
          pinCode: credentials?.pinCode,
          deviceType: credentials?.deviceType,
        });

        if (!input.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            userName: input.data.userName,
          },
        });
        if (!user) {
          return null;
        }

        const pincodeIsValid = await verifyPincode(
          input.data.pinCode,
          user.pinHash,
        );
        if (!pincodeIsValid) {
          return null;
        }

        const isAdminOnly = credentials?.adminOnly === "true";
        if (
          isAdminOnly &&
          user.role !== "ADMIN" &&
          user.role !== "SUPERADMIN"
        ) {
          return null;
        }

        const authRole = isAdminOnly ? user.role : "USER";

        const loginMethod: LoginMethod = "PASSOWRD";
        const deviceType = input.data.deviceType as DeviceType;
        await db.userLogin
          .create({
            data: {
              userId: user.id,
              deviceType,
              loginMethod,
            },
          })
          .catch((error) => {
            console.error("Failed to write login analytics", error);
          });

        return {
          id: String(user.id),
          userId: user.id,
          role: authRole,
          name: `${user.firstName} ${user.lastName}`.trim(),
        };
      },
    }),
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile, user, account }) {
      console.log("JWT callback triggered with:", {
        token,
        profile,
        hasUser: Boolean(user),
        provider: account?.provider,
      });

      if (user && "userId" in user && typeof user.userId === "number") {
        token.userId = user.userId;
      }

      if (
        user &&
        "role" in user &&
        (user.role === "USER" ||
          user.role === "ADMIN" ||
          user.role === "SUPERADMIN")
      ) {
        token.role = user.role;
      }

      if (profile) {
        token.keycloakSub = profile.sub;
        token.email = profile.email ?? token.email;
        token.given_name = (profile as Record<string, unknown>).given_name as
          | string
          | undefined;
        token.family_name = (profile as Record<string, unknown>).family_name as
          | string
          | undefined;
      }

      if (account?.provider === "keycloak" && token.keycloakSub) {
        const linkedUser = await db.keycloakUser.findUnique({
          where: { keycloakSub: token.keycloakSub as string },
          include: { user: true },
        });

        if (linkedUser?.user) {
          token.userId = linkedUser.user.id;
          token.role = linkedUser.user.role;
          token.name =
            `${linkedUser.user.firstName} ${linkedUser.user.lastName}`.trim();
        }
      }

      return token;
    },
    async session({ session, token }) {
      console.log("Session callback triggered with:", { session, token });
      const user = session.user as Record<string, unknown>;
      user.userId = token.userId;
      user.role = token.role;
      user.keycloakSub = token.keycloakSub;
      user.given_name = token.given_name;
      user.family_name = token.family_name;
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Sign-in callback triggered with:", {
        user,
        account,
        profile,
        email,
        credentials,
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback triggered with:", { url, baseUrl });
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const targetUrl = new URL(url);
        if (targetUrl.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
  },
};
