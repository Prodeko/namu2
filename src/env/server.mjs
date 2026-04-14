import { z } from "zod";

import { createEnv } from "@t3-oss/env-nextjs";

export const serverEnv = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production", "staging"])
      .default("development"),
    IRON_SESSION_PASSWORD: z.string().min(32),
    AUTH_SECRET: z.string().min(32),
    AUTH_KEYCLOAK_ID: z.string(),
    AUTH_KEYCLOAK_SECRET: z.string(),
    AUTH_KEYCLOAK_ISSUER: z.string().url(),
    NEXTAUTH_URL: z.string().url(),
    STRIPE_TESTMODE_SECRET_KEY: z.string(),
    SERVER_AZURE_BLOB_CONNECTION_STRING: z.string(),
    AZURE_BLOB_CONTAINER_NAME: z.enum(["prod", "staging"]).default("staging"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    IRON_SESSION_PASSWORD: process.env.IRON_SESSION_PASSWORD,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_KEYCLOAK_ID: process.env.AUTH_KEYCLOAK_ID,
    AUTH_KEYCLOAK_SECRET: process.env.AUTH_KEYCLOAK_SECRET,
    AUTH_KEYCLOAK_ISSUER: process.env.AUTH_KEYCLOAK_ISSUER,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    STRIPE_TESTMODE_SECRET_KEY: process.env.STRIPE_TESTMODE_SECRET_KEY,
    SERVER_AZURE_BLOB_CONNECTION_STRING:
      process.env.SERVER_AZURE_BLOB_CONNECTION_STRING,
    AZURE_BLOB_CONTAINER_NAME:
      process.env.NEXT_PUBLIC_AZURE_BLOB_CONTAINER_NAME,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  isServer: typeof window === "undefined",
});
